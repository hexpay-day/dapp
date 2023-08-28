import type { StakeManager } from "@hexpayday/stake-manager/artifacts/types";
import * as addresses from './addresses'
import { all } from './contracts'
import type { ethers } from "ethers";
import { derived, get } from "svelte/store";
import { scoped, setScoped } from './local'
import { writable } from 'svelte/store'
import { hexData } from "./hex";
import { address, chainId, signer } from "./web3";
import type { ApprovalStep, StakeStartStep, Step, Tasks } from "../types";
import { TaskType, FundingOrigin } from '../types'

export const addToSequence = (type: TaskType, task: Tasks) => {
  items.update(($items) => (
    $items.concat({
      task,
      type,
    })
  ))
}

export const removeFromSequence = (seq: Step) => {
  items.update(($items) => (
    $items.filter((i) => i !== seq)
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
