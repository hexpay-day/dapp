import { derived, get, readable, writable, type Writable } from "svelte/store";
import * as contracts from './contracts'
// import { onDestroy } from "svelte";
import { chainId, signer } from "./web3";
import * as todos from './todo'

export const targetDay = writable(1)

export const dayToIso = (day = 0n) => {
  const DAY_MS = 24n * 60n * 60n * 1_000n
  const daysFrom0 = 18233n + day
  const iso = (new Date(Number((daysFrom0 * DAY_MS).toString()))).toISOString()
  return `${iso.split('T')[0]}Z`
}

export const getCurrentDay = async () => {
  const s = await get(signer)
  const mainnet = contracts.all(get(chainId), s)
  const hexCurrentDay = await mainnet.hex.currentDay()
  currentDay.update(() => Number(hexCurrentDay))
  return Number(hexCurrentDay)
}

setInterval(() => {
  // we can use a request animation frame to bolster this
  // but going directly to the chain is useful for development purposes
  getCurrentDay()
}, 10_000)

export const useISO = writable<boolean>(false)
export const timezoneLabel = derived([useISO], ([$useISO]) => (
  $useISO ? 'utc' : 'local'
))

export const launchDate = new Date('2019-12-03')
export const MIN = 1000*60
export const DAY = MIN*60*24
export const today = () => {
  return truncatedDay(new Date())
}
export const truncatedDay = (target: Date) => {
  let t = +target
  t -= t % DAY
  return new Date(t)
}
export const maxDays = 5_555
export const timezoneOffset = (d = new Date()) => d.getTimezoneOffset() * MIN
export const currentDay = writable<number | null>(null)
export const dateToDay = (d: Date) => {
  return Math.floor((+d - +launchDate) / DAY)
}
export const dayToDate = (day: number) => {
  return new Date(+launchDate + (day * DAY))
}
export const dateAsString = (target: Date) => {
  return target.toISOString().split('T')[0]
}
export const dateTimeAsString = (target: Date) => {
  const iso = target.toISOString()
  const [date, time] = iso.split('T')
  const [hours, minutes, ] = time.split(':')
  return `${date} ${hours}:${minutes}`
}

const n = new Date()
export const now = readable<Date>(n, (set) => {
  const todo = todos.addToLoop(() => {
    set(new Date())
  })
  return () => todos.removeFromLoop(todo)
})
export const nowDate = readable<Date>(n, (set) => {
  let current = truncatedDay(get(now))
  const todo = todos.addToLoop(() => {
    const $now = get(now)
    const $nowTruncated = truncatedDay($now)
    if ($nowTruncated.toISOString() !== current.toISOString()) {
      set($nowTruncated)
    }
  })
  return () => todos.removeFromLoop(todo)
})

const getStartDateISO = ($now: Date) => {
  return truncatedDay(new Date(+$now + DAY))
}
const getMinDateISO = ($now: Date) => {
  return new Date(+truncatedDay($now) + (DAY * 2))
}
export const getMaxDateISO = ($now: Date) => {
  return new Date(+$now + DAY + (DAY * maxDays))
}
export const startDateISO = derived([nowDate], ([$nowDate]) => getStartDateISO($nowDate))
export const minDateISO = derived([nowDate], ([$nowDate]) => getMinDateISO($nowDate))
export const maxDateISO = derived([nowDate], ([$nowDate]) => getMaxDateISO($nowDate))
export const startDateLocal = derived([startDateISO], ([$startDateISO]) => {
  return new Date(+$startDateISO - timezoneOffset($startDateISO))
})
export const minDateLocal = derived([minDateISO], ([$minDateISO]) => {
  return new Date(+$minDateISO + timezoneOffset($minDateISO))
})
