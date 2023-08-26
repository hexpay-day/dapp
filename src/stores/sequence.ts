import type { StakeManager } from "@hexpayday/stake-manager/artifacts/types";
import { all } from './contracts'
import type { ethers } from "ethers";
import { derived, get } from "svelte/store";
import { scoped, setScoped } from './local'
import { writable } from 'svelte/store'
import { hexData } from "./hex";
import { address, chainId, signer } from "./web3";
import type { Step, Tasks } from "../types";
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
  const $ordered: TaskGroup[] = []
  let $bal = $hexData.balance
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
  return $ordered
})

export const executeList = async ($group: TaskGroup) => {
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
    }
  }
  const stepsCalldata = items.map((step) => getCalldataFromTask(contracts.stakeManager, step))
  await contracts.stakeManager.multicall(stepsCalldata, false)
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
  }
  return false
}

const getCalldataFromStartTask = async (stakeManager: StakeManager, step: Step) => {
  const {
    for: recipient,
    fundingOrigin,
    settings,
  } = step.task
  const encodedSettings = await stakeManager.encodeSettings(settings)
    .catch((err) => {
      console.log(err)
      throw err
    })
  if (fundingOrigin === FundingOrigin.connected) {
    return stakeManager.interface.encodeFunctionData('stakeStartFromBalanceFor', [
      recipient as string,
      step.task.amount as ethers.BigNumberish,
      step.task.lockedDays,
      encodedSettings,
    ])
  } else if (fundingOrigin === FundingOrigin.deposited) {
    return stakeManager.interface.encodeFunctionData('stakeStartFromWithdrawableFor', [
      recipient as string,
      step.task.amount as ethers.BigNumberish,
      step.task.lockedDays,
      encodedSettings,
    ])
  } else if (fundingOrigin === FundingOrigin.unattributed) {
    return stakeManager.interface.encodeFunctionData('stakeStartFromUnattributedFor', [
      recipient as string,
      step.task.amount as ethers.BigNumberish,
      step.task.lockedDays,
      encodedSettings,
    ])
  }
  throw new Error('unknown funding origination')
}
