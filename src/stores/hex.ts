import { get, readable, writable } from "svelte/store"

import * as contracts from './contracts'
import { ethers } from "ethers"
import { address, chainId, publicProvider, signer } from "./web3"
import _ from "lodash"

export const balance = writable(0n)
export const deposited = writable(0n)
export const isolated = writable(0n)

export type HexData = {
  balance: bigint;
  deposited: bigint;
  isolated: bigint;
}

export const hexData = readable<HexData>({
  balance: 0n,
  deposited: 0n,
  isolated: 0n,
}, (set) => {
  let current!: HexData
  const update = async () => {
    const $chainId = get(chainId)
    const $address = get(address)
    const $publicProvider = get(publicProvider)
    if (!$publicProvider) return
    if (!$chainId) return
    if (!ethers.utils.isAddress($address)) return
    if (ethers.constants.AddressZero === $address) return
    const c = contracts.all($chainId, $publicProvider)
    const [bal, dep, iso] = await Promise.all([
      c.hex.balanceOf($address)
        .then((res) => res.toBigInt() || 0n),
      c.stakeManager.withdrawableBalanceOf(c.hex.address, $address)
        .then((res) => res.toBigInt() || 0n),
      // isolated not yet available
      ethers.BigNumber.from(0).toBigInt(),
    ])
    const result = {
      balance: bal,
      deposited: dep,
      isolated: iso,
    }
    if (_.isEqual(result, current)) return
    current = result
    set(result)
  }
  let id: any
  const loop = async () => {
    update()
    id = setTimeout(loop, 5_000)
  }
  loop()
  const cIdSub = chainId.subscribe(update)
  const addSub = address.subscribe(update)
  return () => {
    cIdSub()
    addSub()
    clearTimeout(id)
  }
})

export const fetchData = async ($chainId: number, address: string) => {
  if (!$chainId) return
  if (!ethers.utils.isAddress(address)) {
    return
  }
  if (ethers.constants.AddressZero === address) {
    return
  }
  const $signer = get(signer)
  if (!$signer) return
  const c = contracts.all($chainId, $signer)
  const [bal, dep, iso] = await Promise.all([
    c.hex.balanceOf(address),
    ethers.BigNumber.from(0),
    ethers.BigNumber.from(0),
  ])
  balance.set(bal.toBigInt() || (1_000n * (10n**8n)))
  deposited.set(dep.toBigInt())
  isolated.set(iso.toBigInt())
}
