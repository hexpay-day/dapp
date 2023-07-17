import { writable } from "svelte/store"

import * as contracts from './contracts'
import { ethers } from "ethers"

export const balance = writable(0n)
export const deposited = writable(0n)
export const isolated = writable(0n)

export const fetchData = async (chainId: number, address: string) => {
  if (!ethers.utils.isAddress(address)) {
    return
  }
  if (ethers.constants.AddressZero === address) {
    return
  }
  const c = contracts.all(chainId)
  const [bal, dep, iso] = await Promise.all([
    c.hex.balanceOf(address),
    ethers.BigNumber.from(0),
    ethers.BigNumber.from(0),
  ])
  balance.update(() => bal.toBigInt())
  deposited.update(() => dep.toBigInt())
  isolated.update(() => iso.toBigInt())
}
