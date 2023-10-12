import type { ExistingStakeManager, StakeManager } from "@hexpayday/stake-manager/artifacts/types";
import * as addresses from './addresses'
import { all } from './contracts'
import type * as ethers from "ethers";
import { derived, get } from "svelte/store";
import { scoped, setScoped } from './local'
import { writable } from 'svelte/store'
import { hexData } from "./hex";
import { address, chainId, provider, signer } from "./web3";
import { ContractType, type ApprovalStep, type StakeStartStep, type Step, type Tasks, type DepositHsiStep, type WithdrawStep, type EndStep } from "../types";
import { TaskType, FundingOrigin } from '../types'
import * as backend from './backend'
import _ from "lodash";

type AllContracts = Awaited<ReturnType<typeof getContracts>>
type RpcMethods = 'send' | 'staticCall' | 'estimateGas' | 'accessList' | 'populateTransaction'

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

const getContracts = async () => {
  const $signer = await get(signer)
  const $chainId = get(chainId)
  if (!$signer || !$chainId) {
    throw new Error('not connected to wallet')
  }
  return all($chainId, $signer)
}

// all methods called here must be write otherwise a tx will be called on a view method
const _callOnContracts = async (
  contracts: AllContracts,
  step: Step,
  rpcMethod: RpcMethods = 'send',
  overrides: ethers.Overrides = {},
) => {
  if (rpcMethod === 'accessList') {
    throw new Error('internal call on access list not supported')
  }
  let extra: [ethers.Overrides] | [] = []
  if (!_.isEmpty(overrides)) {
    extra = [overrides]
  }
  if (step.type === TaskType.start) {
    const task = step.task as StakeStartStep
    return contracts.stakeManager.stakeStart[rpcMethod](
      task.amount as bigint,
      task.lockedDays,
      ...extra,
    )
  } else if (step.type === TaskType.approval) {
    const task = step.task as ApprovalStep
    return contracts.hex.approve[rpcMethod](
      task.spender,
      task.consumed - task.allowance,
      ...extra,
    )
  } else if (step.type === TaskType.depositHsi) {
    const task = step.task as DepositHsiStep
    return contracts.existingStakeManager.depositHsi[rpcMethod](
      task.tokenId,
      task.settingsEncoded,
      ...extra,
    )
  } else if (step.type === TaskType.withdrawHsi) {
    const task = step.task as WithdrawStep
    return contracts.existingStakeManager.withdrawHsi[rpcMethod](
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
  rpcMethod: RpcMethods = 'send',
  overrides?: ethers.Overrides,
) => {
  if (rpcMethod === 'accessList') {
    const tx = await _callOnContracts(contracts, step, 'populateTransaction') as ethers.Transaction
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
  accessList: ethers.AccessList;
  gasUsed: bigint;
}

export const defaultAccessListResponse: AccessListResponse = {
  accessList: [],
  gasUsed: 0n,
}

const createAccessListFromDebug = async (
  $provider: ethers.BrowserProvider,
  contracts: AllContracts,
  step: Step,
  tx: ethers.Transaction,
) : Promise<AccessListResponse> => {
  // console.log(tx)
  // const debug = await $provider.send('debug_traceCall', [tx]).catch(() => null)
  // console.log(debug)
  return {
    ...defaultAccessListResponse,
  }
}

export const estimateGas = async (step: Step) => {
  const contracts = await getContracts()
  let accessListResponse = {
    ...defaultAccessListResponse,
  }
  if (step.optimize) {
    accessListResponse = await callOnContracts(contracts, step, 'accessList') as AccessListResponse
  }
  const gasUsed = await callOnContracts(contracts, step, 'estimateGas')
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
      const hash = receipt?.hash
      console.log('tx mined %o', hash)
      await backend.clearCache({
        chainId: get(chainId),
        account: get(address),
        hash: hash,
      })
      return true
    }).catch((err) => {
      // console.log(err.reason)
      return false
    })
}

export const executeListOfTasks = async ($group: TaskGroup) => {
  const { items, invalid, contract } = $group
  if (invalid) {
    return null
  }
  const $signer = await get(signer)
  const $chainId = get(chainId)
  if (!$signer || !$chainId) {
    throw new Error('not connected to wallet')
  }
  const contracts = all($chainId, $signer)
  if (items.length === 1 && useOptimizedPath(items[0])) {
    // do not wrap in a multicall - call direct
    const [item] = items
    return callOnContracts(contracts, item, 'send') as Promise<ethers.ContractTransactionResponse>
  }
  const calldata = await Promise.all(items.map((step) => getCalldataFromTask(contracts, step)))
  const overrides = {
    // gasLimit: 10_000_000,
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
  } else if (step.type === TaskType.endStake) {
    return getCalldataFromEndStakeTask(contracts.existingStakeManager, step)
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

const getCalldataFromEndStakeTask = (existingStakeManager: ExistingStakeManager, step: Step) => {
  const task = step.task as EndStep
  const ownerIsPerpetual = addresses.perpetuals.has(task.stake.owner)
  if (ownerIsPerpetual) {
    return existingStakeManager.interface.encodeFunctionData('stakeEndAs', [
      get(address), // reward to self
      task.stake.owner,
      task.stake.stakeId,
    ])
  }
  return existingStakeManager.interface.encodeFunctionData('hsiStakeEndMany', [
    [task.stake.custodian],
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
    .catch((err: any) => {
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
