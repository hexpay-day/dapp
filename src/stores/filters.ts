import { get, writable } from "svelte/store";
import { provider, publicProvider } from "./web3";
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
  const p = get(publicProvider)
  if (!p) return
  let ens
  // let isValid: null | boolean = null
  if (!ownerValue) {
    isOwnerValueValid
    return
  }
  if (hash.startsWith('0x') && hash.length === 42) {
    // assume it is an address - not ens
    const isValid = ethers.isAddress(hash)
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
      hash = await p.resolveName(ens).catch(() => hash) || hash
      isOwnerValueValid.set(ethers.isAddress(hash))
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
    hash: ethers.getAddress(hash),
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
