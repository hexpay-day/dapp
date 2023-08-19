import { derived, get, writable } from "svelte/store";
import { provider } from "./web3";
import { ethers } from "ethers";
import _ from "lodash";

export const endable = writable<boolean>(false)

export const endableChanged = (checked: boolean) => {
  endable.set(checked)
}
export const optimizable = writable<boolean>(true)
export const onlyOptimizableChanged = (checked: boolean) => {
  optimizable.set(checked)
}

export type Address = {
  hash: string;
  ens: string | null | undefined;
}

export const owners = writable<Address[]>([])
export const ownerValue = writable<string>('')
export const isOwnerValueValid = writable<null | boolean>(null)
export const addAddressToOwner = async (submission: boolean) => {
  const hash = get(ownerValue)
  return await addAddressToOwnerRaw(hash, submission)
}
export const addAddressToOwnerRaw = async (_hash: string, submission: boolean) => {
  let hash = _hash
  const p = provider()
  let ens
  // let isValid: null | boolean = null
  if (!ownerValue) {
    isOwnerValueValid
    return
  }
  if (hash.startsWith('0x') && hash.length === 42) {
    // assume it is an address - not ens
    const isValid = ethers.utils.isAddress(hash)
    isOwnerValueValid.set(isValid)
    if (isValid) {
      ens = await p.lookupAddress(hash).catch(() => null)
    }
  } else {
    // look for suffixes
    hash = hash.toLowerCase()
    if (hash.endsWith('.pls') || hash.endsWith('.eth')) {
      // lookup owner address
      ens = hash
      hash = await p.resolveName(hash).catch(() => hash) || hash
      isOwnerValueValid.set(ethers.utils.isAddress(hash))
    } else {
      isOwnerValueValid.set(false)
    }
  }
  if (!get(isOwnerValueValid)) {
    return
  }
  if (!submission) {
    return
  }
  const address = {
    hash: ethers.utils.getAddress(hash),
    ens,
  }
  removeOwner(address)
  owners.update((list) => (
    list.concat(address)
  ))
  ownerValue.set('')
}
export const removeOwner = (owner: Address) => {
  owners.update((list) => (
    list.filter((item) => item.hash !== owner.hash)
  ))
}

export const stakeIdValue = writable<string>('')
export const stakeIds = writable<number[]>([])
export const isStakeIdValid = writable<null | boolean>(null)
export const addStakeIdToList = (submission: boolean) => {
  const stakeId = +get(stakeIdValue)
  isStakeIdValid.set(_.isNumber(stakeId) && !_.isNaN(stakeId))
  if (!get(isStakeIdValid)) {
    return
  }
  if (!submission) {
    return
  }
  removeStakeId(stakeId)
  stakeIds.update((list) => (
    list.concat(stakeId)
  ))
  stakeIdValue.set('')
}
export const removeStakeId = (stakeId: number) => {
  stakeIds.update((list) => (
    list.filter((item) => item !== stakeId)
  ))
}

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
export const timezoneOffset = (new Date()).getTimezoneOffset() * MIN
export const maxOffsetDays = 30
export const defaultOffsetDays = 2
export const offsetDays = writable<number>(defaultOffsetDays)
export const startDate = writable<Date>(today())
export const untilDate = derived([offsetDays, startDate], ([$offsetDays, $startDate]) => {
  return new Date(+$startDate + (DAY * $offsetDays))
})
export const currentDay = writable<number | null>(null)
export const maxDate = new Date(+today() + (DAY * 5_555))
export const dateToDay = (d: Date) => {
  return Math.floor((+d - +launchDate) / DAY)
}
export const dayToDate = (day: number) => {
  return new Date(+launchDate + (day * DAY))
}
export const dateAsString = (target: Date) => {
  return target.toISOString().split('T')[0]
}
