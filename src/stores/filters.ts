import { get, writable } from "svelte/store";
import { provider } from "./web3";
import { ethers } from "ethers";
import _ from "lodash";

export const endable = writable<boolean>(true)
export const pastStakes = writable<boolean>(false)

export const endableChanged = () => {}
export const pastChanged = () => {}

type Address = {
  hash: string;
  ens: string | null | undefined;
};
export const owners = writable<Address[]>([])
export const ownerValue = writable<string>('')
export const isOwnerValueValid = writable<null | boolean>(null)
export const addAddressToOwner = async (submission: boolean) => {
  const p = provider()
  let hash = get(ownerValue)
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
