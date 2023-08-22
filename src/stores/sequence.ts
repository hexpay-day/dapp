import type { EncodableSettings } from "@hexpayday/stake-manager/artifacts/types";
import type { BigNumberish } from "ethers";
import { derived } from "svelte/store";
import { writable } from './local'

export enum TaskType {
  start,
}

// export type TaskType = keyof taskTypes

export type StakeStartTask = {
  // fund from contract or from balance
  // assume from balance for now
  amount: BigNumberish | null;
  for: string | null;
  lockedDays: string;
  settings: EncodableSettings.SettingsStruct;
}

export type Tasks = StakeStartTask;

export type Sequence = {
  task: Tasks;
  type: TaskType;
  invalid?: boolean;
}

export const addToSequence = (type: TaskType, task: Tasks) => {
  items.update(($items) => (
    $items.concat({
      task,
      type,
    })
  ))
}

export const items = writable<Sequence[]>('sequence.items', [])

export const ordered = derived([items], ([$items]) => {
  return [$items.map((task) => ({
    ...task,
    invalid: false,
  }))]
})
