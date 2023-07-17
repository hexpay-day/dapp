import { writable } from "svelte/store";
import * as contracts from './contracts'

export const day = writable(0n)

export const targetDay = writable(1n)

export const dayToIso = (day = 0n) => {
  const DAY_MS = 24n * 60n * 60n * 1_000n
  const daysFrom0 = 18233n + day
  const iso = (new Date(Number((daysFrom0 * DAY_MS).toString()))).toISOString()
  return `${iso.split('T')[0]}Z`
}

export const getCurrentDay = async () => {
  const mainnet = contracts.all(1)
  const currentDay = await mainnet.hex.currentDay()
  // console.log('current day', currentDay.toBigInt())
  day.update(() => currentDay.toBigInt())
  return currentDay.toBigInt()
}
