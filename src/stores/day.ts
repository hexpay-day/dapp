import { derived, writable } from "svelte/store";
import * as contracts from './contracts'

// export const currentDay = writable(0)

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
  $useISO ? 'iso' : 'local'
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
export const timezoneOffset = (d = new Date()) => d.getTimezoneOffset() * MIN
export const currentDay = writable<number | null>(null)
export const maxDate = new Date(+today() + DAY + (DAY * 5_555))
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
