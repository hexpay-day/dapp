import { ethers } from "ethers"
import { derived, get, writable } from "svelte/store"
import { address } from "./web3"
import _ from 'lodash';

export const account = writable(get(address))
address.subscribe(($address) => {
  account.set($address)
})

const validateAddress = (acc: string) => {
  return ethers.utils.isAddress(acc)
}
export const validAccount = derived([account], ([$account]) => {
  return validateAddress($account)
})
export const validatedAccount = derived([account], ([$account]) => {
  return ethers.utils.isAddress($account) ? $account : null
})
