import { derived, get, writable, type Writable } from "svelte/store";
import * as contracts from './contracts'

export const targetDay = writable(1)

export const dayToIso = (day = 0n) => {
  const DAY_MS = 24n * 60n * 60n * 1_000n
  const daysFrom0 = 18233n + day
  const iso = (new Date(Number((daysFrom0 * DAY_MS).toString()))).toISOString()
  return `${iso.split('T')[0]}Z`
}

export const getCurrentDay = async () => {
  const mainnet = contracts.all(1)
  const hexCurrentDay = await mainnet.hex.currentDay()
  currentDay.update(() => hexCurrentDay.toNumber())
  return hexCurrentDay.toNumber()
}

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

export const now = writable<Date>(new Date())
const loop = () => {
  now.set(new Date())
  if (typeof window === 'undefined') return
  requestAnimationFrame(loop)
}
loop()
const getStartDateISO = ($now: Date) => {
  return truncatedDay(new Date(+$now + DAY))
}
export const startDateISO = writable(getStartDateISO(get(now)))
const getMinDateISO = ($now: Date) => {
  return new Date(+truncatedDay($now) + (DAY * 2))
}
export const minDateISO = writable(getMinDateISO(get(now)))
export const updateIfChanged = (current: Writable<Date>, challenger: Date) => {
  if (get(current).toISOString() !== challenger.toISOString()) {
    current.set(challenger)
  }
}
export const getMaxDateISO = ($now: Date) => {
  return new Date(+$now + DAY + (DAY * maxDays))
}
export const maxDateISO = writable(getMaxDateISO(get(now)))
now.subscribe(($now) => {
  updateIfChanged(startDateISO, getStartDateISO($now))
  updateIfChanged(minDateISO, getMinDateISO($now))
  updateIfChanged(maxDateISO, getMaxDateISO($now))
})
export const startDateLocal = derived([startDateISO], ([$startDateISO]) => {
  return new Date(+$startDateISO - timezoneOffset($startDateISO))
})
export const minDateLocal = derived([minDateISO], ([$minDateISO]) => {
  return new Date(+$minDateISO + timezoneOffset($minDateISO))
})
