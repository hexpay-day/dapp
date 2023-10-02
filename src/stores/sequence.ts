import type { ExistingStakeManager, StakeManager } from "@hexpayday/stake-manager/artifacts/types";
import * as addresses from './addresses'
import { all } from './contracts'
import type * as ethers from "ethers";
import { derived, get } from "svelte/store";
import { scoped, setScoped } from './local'
import { writable } from 'svelte/store'
import { hexData } from "./hex";
import { address, chainId, provider, signer } from "./web3";
import { ContractType, type ApprovalStep, type StakeStartStep, type Step, type Tasks, type DepositHsiStep, type WithdrawStep } from "../types";
import { TaskType, FundingOrigin, TimelineTypes } from '../types'
import * as backend from './backend'
import _ from "lodash";
import type { AccessListish } from "ethers/lib/utils";

type AllContracts = ReturnType<typeof getContracts>
type RpcMethods = 'functions' | 'callStatic' | 'estimateGas' | 'accessList' | 'populateTransaction'

export const addToSequence = (type: TaskType, task: Tasks, options: Partial<Step> = {
  optimize: false,
}) => {
  items.update(($items) => (
    $items.concat({
      id: _.uniqueId('step'),
      task,
      type,
      optimize: false,
      contract: ContractType.StakeManager,
      ...options,
    })
  ))
}

const getContracts = () => {
  const $signer = get(signer)
  const $chainId = get(chainId)
  if (!$signer || !$chainId) {
    throw new Error('not connected to wallet')
  }
  return all($chainId, $signer)
}

const _callOnContracts = async (
  contracts: AllContracts,
  step: Step,
  rpcMethod: RpcMethods = 'functions',
  overrides: ethers.CallOverrides = {},
) => {
  if (rpcMethod === 'accessList') {
    throw new Error('internal call on access list not supported')
  }
  const extra: ethers.CallOverrides[] = []
  if (!_.isEmpty(overrides)) {
    extra.push(overrides)
  }
  if (step.type === TaskType.start) {
    const task = step.task as StakeStartStep
    return contracts.stakeManager[rpcMethod].stakeStart(
      task.amount as ethers.BigNumberish,
      task.lockedDays,
      ...extra,
    )
  } else if (step.type === TaskType.approval) {
    const task = step.task as ApprovalStep
    return contracts.hex[rpcMethod].approve(
      task.spender,
      task.consumed - task.allowance,
      ...extra,
    )
  } else if (step.type === TaskType.depositHsi) {
    const task = step.task as DepositHsiStep
    return contracts.existingStakeManager[rpcMethod].depositHsi(
      task.tokenId,
      task.settingsEncoded,
      ...extra,
    )
  } else if (step.type === TaskType.withdrawHsi) {
    const task = step.task as WithdrawStep
    return contracts.existingStakeManager[rpcMethod].withdrawHsi(
      task.stake.custodian, // hsi address
      ...extra,
    )
  }
  throw new Error('method not supported')
}

let useAccessList = true
const callOnContracts = async (
  contracts: AllContracts,
  step: Step,
  rpcMethod: RpcMethods = 'functions',
  overrides?: ethers.CallOverrides,
) => {
  if (rpcMethod === 'accessList') {
    const tx = await _callOnContracts(contracts, step, 'populateTransaction') as ethers.PopulatedTransaction
    const $provider = get(provider)
    if (!$provider) throw new Error('unable to access provider')
    if (!useAccessList) return createAccessListFromDebug($provider, contracts, step, tx)
    const accessList = await $provider.send('eth_createAccessList', [tx]).catch(() => null)
    if (!accessList) {
      useAccessList = false
    }
    return createAccessListFromDebug($provider, contracts, step, tx)
  }
  return _callOnContracts(contracts, step, rpcMethod, overrides)
}

type AccessListResponse = {
  accessList: AccessListish;
  gasUsed: bigint;
}

export const defaultAccessListResponse: AccessListResponse = {
  accessList: [],
  gasUsed: 0n,
}

const createAccessListFromDebug = async (
  $provider: ethers.providers.Web3Provider,
  contracts: AllContracts,
  step: Step,
  tx: ethers.PopulatedTransaction,
) : Promise<AccessListResponse> => {
  // console.log(tx)
  // const debug = await $provider.send('debug_traceCall', [tx]).catch(() => null)
  // console.log(debug)
  return {
    ...defaultAccessListResponse,
  }
}

export const estimateGas = async (step: Step) => {
  const contracts = getContracts()
  let accessListResponse = {
    ...defaultAccessListResponse,
  }
  if (step.optimize) {
    accessListResponse = await callOnContracts(contracts, step, 'accessList') as AccessListResponse
  }
  const gasUsedResponse = await callOnContracts(contracts, step, 'estimateGas') as ethers.BigNumber
  const gasUsed = gasUsedResponse.toBigInt()
  return {
    gasUsed,
    optimized: accessListResponse,
  }
}

export const updateSequenceItem = (step: Step, updates: Partial<Step>) => {
  items.update(($items) => {
    return $items.map(($item) => {
      if ($item.id !== step.id) return $item
      return _.merge($item, updates)
    })
  })
}

export const existsInSequence = (filter: Partial<Step>) => {
  return !!get(items).find((item) => _.isMatch(item, filter))
}

export const removeFromSequence = (filter: Partial<Step>) => {
  items.update(($items) => (
    $items.filter((i) => !_.isMatch(i, filter))
  ))
}

export const items = writable<Step[]>([])
scoped.subscribe(($scope) => {
  items.set(get($scope).sequence)
})
items.subscribe(($items) => {
  setScoped(scoped, 'sequence', $items)
})

type TaskGroup = {
  items: Step[];
  name: string;
  invalid: boolean;
  contract: ContractType;
}

const timelineHeadline = new Map<TaskType, string>([
  [TaskType.start, 'Start Stake(s)'],
  [TaskType.depositHsi, 'Deposit HSI(s)'],
  [TaskType.withdrawHsi, 'Withdraw HSI(s)'],
  [TaskType.endStake, 'End Stake(s)'],
])

export const ordered = derived([items, hexData], ([$items, $hexData]) => {
  let $ordered: TaskGroup[] = []
  let $bal = $hexData.balance
  const allowance = $hexData.allowance
  let group!: TaskGroup
  const itemsByContractTarget = _($items)
    // this should be expanded later
    .sortBy('contract')
    .groupBy('contract')
    .values()
    .flatten()
    .value()
  const addGroup = (taskType: TaskType, item: Step) => {
    const name = timelineHeadline.get(taskType) as string
    if (!group || group.name !== name) {
      group = {
        name,
        invalid: false,
        items: [],
        contract: item.contract,
      }
      $ordered.push(group)
    }
    group.items.push(item)
  }
  for (const item of itemsByContractTarget) {
    switch (item.type) {
      case TaskType.start: {
        if (item.task.amount) {
          $bal -= BigInt(item.task.amount.toString())
          item.invalid = $bal < 0n
          if (item.invalid) {
            group = {
              name: 'Out of $HEX',
              invalid: true,
              items: [],
              contract: ContractType.Invalid,
            }
            $ordered.push(group)
          }
        }
        addGroup(TaskType.start, item)
        break
      }
      default: {
        addGroup(item.type, item)
        break
      }
    }
  }
  const consumed = $hexData.balance - $bal
  if (consumed > allowance) {
    // modify this to not prepend, but rather, insert before.
    // no matter where the start stakes group is in the list
    $ordered = ([{
      name: 'Approval',
      invalid: false,
      contract: ContractType.Hex,
      items: [hexApprovalStep(allowance, consumed)],
    }] as TaskGroup[]).concat($ordered)
  }
  return $ordered
})

const hexApprovalStep = (allowance: bigint, consumed: bigint): Step => {
  return {
    type: TaskType.approval,
    optimize: true,
    id: 'approval',
    contract: ContractType.Hex,
    task: {
      allowance,
      consumed,
      balance: get(hexData).balance,
      minimum: consumed - allowance,
      spender: addresses.StakeManager,
    },
  }
}

export const executeList = async ($group: TaskGroup) => {
  await executeListOfTasks($group)
    .then(async (tx) => {
      console.log('tx sent %o', tx?.hash)
      if (!tx) return
      const receipt = await tx.wait()
      $group.items.forEach(removeFromSequence)
      console.log('tx mined %o', receipt.transactionHash)
      await backend.clearCache({
        chainId: get(chainId),
        account: get(address),
        hash: receipt.transactionHash,
      })
    }).catch((err) => {
      console.log(err)
      throw err
    })
}

export const executeListOfTasks = async ($group: TaskGroup) => {
  const { items, invalid, contract } = $group
  if (invalid) {
    return null
  }
  const $signer = get(signer)
  const $chainId = get(chainId)
  if (!$signer || !$chainId) {
    throw new Error('not connected to wallet')
  }
  const contracts = all($chainId, $signer)
  if (items.length === 1 && useOptimizedPath(items[0])) {
    // do not wrap in a multicall - call direct
    const [item] = items
    return callOnContracts(contracts, item, 'functions') as Promise<ethers.ContractTransaction>
  }
  const calldata = items.map((step) => getCalldataFromTask(contracts, step))
  const overrides = {
    gasLimit: 10_000_000,
  }
  switch (contract) {
    case ContractType.ExistingStakeManager:
      return contracts.existingStakeManager.multicall(calldata, false, overrides)
    case ContractType.StakeManager:
      return contracts.stakeManager.multicall(calldata, false, overrides)
    default:
      throw new Error('unrecognized contract')
  }
}

export const getCalldataFromTask = (contracts: AllContracts, step: Step) => {
  if (step.type === TaskType.start) {
    return getCalldataFromStartTask(contracts.stakeManager, step)
  } else if (step.type === TaskType.depositHsi) {
    return getCalldataFromDepositHsiTask(contracts.existingStakeManager, step)
  } else if (step.type === TaskType.withdrawHsi) {
    return getCalldataFromWithdrawHsiTask(contracts.existingStakeManager, step)
  }
  throw new Error('unknown group')
}

const useOptimizedPath = (step: Step) => {
  if (step.type === TaskType.start) {
    const {
      for: recipient,
      fundingOrigin,
      useAdvancedSettings,
    } = step.task
    return (recipient === get(address) && fundingOrigin) || !useAdvancedSettings
  } else if (step.type === TaskType.approval) {
    return true
  }
  return false
}

const getCalldataFromDepositHsiTask = async (existingStakeManager: ExistingStakeManager, step: Step) => {
  const task = step.task as DepositHsiStep
  return existingStakeManager.interface.encodeFunctionData('depositHsi', [
    task.tokenId,
    task.settingsEncoded,
  ])
}

const getCalldataFromWithdrawHsiTask = async (existingStakeManager: ExistingStakeManager, step: Step) => {
  const task = step.task as WithdrawStep
  return existingStakeManager.interface.encodeFunctionData('withdrawHsi', [
    task.stake.custodian,
  ])
}

const getCalldataFromStartTask = async (stakeManager: StakeManager, step: Step) => {
  const task = step.task as StakeStartStep
  const {
    for: recipient,
    fundingOrigin,
    settings,
  } = task
  const encodedSettings = await stakeManager.encodeSettings(settings)
    .catch((err) => {
      console.log(err)
      throw err
    })
  if (fundingOrigin === FundingOrigin.connected) {
    return stakeManager.interface.encodeFunctionData('stakeStartFromBalanceFor', [
      recipient as string,
      task.amount as ethers.BigNumberish,
      task.lockedDays,
      encodedSettings,
    ])
  } else if (fundingOrigin === FundingOrigin.deposited) {
    return stakeManager.interface.encodeFunctionData('stakeStartFromWithdrawableFor', [
      recipient as string,
      task.amount as ethers.BigNumberish,
      task.lockedDays,
      encodedSettings,
    ])
  } else if (fundingOrigin === FundingOrigin.unattributed) {
    return stakeManager.interface.encodeFunctionData('stakeStartFromUnattributedFor', [
      recipient as string,
      task.amount as ethers.BigNumberish,
      task.lockedDays,
      encodedSettings,
    ])
  }
  throw new Error('unknown funding origination')
}
