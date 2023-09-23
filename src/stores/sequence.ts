import type { StakeManager } from "@hexpayday/stake-manager/artifacts/types";
import * as addresses from './addresses'
import { all } from './contracts'
import type * as ethers from "ethers";
import { derived, get } from "svelte/store";
import { scoped, setScoped } from './local'
import { writable } from 'svelte/store'
import { hexData } from "./hex";
import { address, chainId, provider, signer } from "./web3";
import type { ApprovalStep, StakeStartStep, Step, Tasks } from "../types";
import { TaskType, FundingOrigin } from '../types'
import _ from "lodash";
import type { AccessListish } from "ethers/lib/utils";

export const addToSequence = (type: TaskType, task: Tasks, optimize = false) => {
  items.update(($items) => (
    $items.concat({
      id: _.uniqueId('step'),
      optimize,
      task,
      type,
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

type RpcMethods = 'functions' | 'callStatic' | 'estimateGas' | 'accessList' | 'populateTransaction'

const _callOnContracts = async (
  contracts: ReturnType<typeof getContracts>,
  step: Step,
  rpcMethod: RpcMethods = 'functions',
  overrides: ethers.CallOverrides = {},
) => {
  if (rpcMethod === 'accessList') throw new Error('internal call on access list not supported')
  const $chainId = get(chainId)
  const extra: ethers.CallOverrides[] = []
  if (!_.isEmpty(overrides)) {
    extra.push(overrides)
  }
  if (step.type === TaskType.start) {
    return contracts.stakeManager[rpcMethod].stakeStart(
      step.task.amount as ethers.BigNumberish,
      step.task.lockedDays,
      ...extra,
    )
  } else if (step.type === TaskType.approval) {
    const task = step.task as ApprovalStep
    return contracts.hex[rpcMethod].approve(
      task.contract,
      task.consumed - task.allowance,
      ...extra,
    )
  }
  throw new Error('method not supported')
}

let useAccessList = true
const callOnContracts = async (
  contracts: ReturnType<typeof getContracts>,
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
  contracts: ReturnType<typeof getContracts>,
  step: Step,
  tx: ethers.PopulatedTransaction,
) : Promise<AccessListResponse> => {
  // console.log(tx)
  const debug = await $provider.send('debug_traceCall', [tx]).catch(() => null)
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
      console.log($item, updates)
      return _.merge($item, updates)
    })
  })
}

export const removeFromSequence = (seq: Step) => {
  // console.log(seq, get(items))
  // setScoped(scoped, 'sequence', get(items).filter((i) => !_.isEqual(i, seq)))
  items.update(($items) => (
    $items.filter((i) => !_.isEqual(i, seq))
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
}

export const ordered = derived([items, hexData], ([$items, $hexData]) => {
  let $ordered: TaskGroup[] = []
  let $bal = $hexData.balance
  const allowance = $hexData.allowance
  let group!: TaskGroup
  for (const task of $items) {
    if (task.type === TaskType.start) {
      if (task.task.amount) {
        $bal -= BigInt(task.task.amount.toString())
        task.invalid = $bal < 0n
        if (task.invalid) {
          group = {
            name: 'Out of $HEX',
            invalid: true,
            items: [],
          }
          $ordered.push(group)
        }
      }
    }
    if (!group) {
      group = {
        name: 'Start Transaction',
        invalid: false,
        items: [],
      }
      $ordered.push(group)
    }
    group.items.push(task)
  }
  const consumed = $hexData.balance - $bal
  if (consumed > allowance) {
    $ordered = ([{
      name: 'Approval',
      invalid: false,
      items: [approvalStep(allowance, consumed)],
    }] as TaskGroup[]).concat($ordered)
  }
  return $ordered
})

const approvalStep = (allowance: bigint, consumed: bigint): Step => {
  return {
    type: TaskType.approval,
    optimize: true,
    id: 'approval',
    task: {
      allowance,
      consumed,
      balance: get(hexData).balance,
      minimum: consumed - allowance,
      contract: addresses.StakeManager,
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
    })
}

export const executeListOfTasks = async ($group: TaskGroup) => {
  const { items, invalid } = $group
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
    if (item.type === TaskType.start) {
      return contracts.stakeManager.stakeStart(
        item.task.amount as ethers.BigNumberish,
        item.task.lockedDays,
      )
    } else if (item.type === TaskType.approval) {
      const task = item.task as ApprovalStep
      return contracts.hex.approve(
        task.contract,
        task.consumed - task.allowance
      )
    }
  }
  const stepsCalldata = items.map((step) => getCalldataFromTask(contracts.stakeManager, step))
  return await contracts.stakeManager.multicall(stepsCalldata, false)
    .then((tx) => {
      $group.items.forEach(removeFromSequence)
      return tx
    })
}

export const getCalldataFromTask = (stakeManager: StakeManager, step: Step) => {
  return getCalldataFromStartTask(stakeManager, step)
}

const useOptimizedPath = (step: Step) => {
  if (step.type === TaskType.start) {
    const {
      for: recipient,
      fundingOrigin,
      useAdvancedSettings,
    } = step.task
    return recipient === get(address) && fundingOrigin || !useAdvancedSettings
  } else if (step.type === TaskType.approval) {
    return true
  }
  return false
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
