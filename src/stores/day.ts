import { writable } from "svelte/store";
import * as contracts from './contracts'

export const day = writable(0n)

export const dayToIso = (day = 0n) => {
  const DAY_MS = 24n * 60n * 60n * 1_000n
  const daysFrom0 = 18233n + day
  const iso = (new Date(Number((daysFrom0 * DAY_MS).toString()))).toISOString()
  return `${iso.split('T')[0]}Z`
}

export const getCurrentDay = async () => {
  const currentDay = await contracts.Hex.currentDay()
  day.update(() => currentDay.toBigInt())
  return currentDay.toBigInt()
}
