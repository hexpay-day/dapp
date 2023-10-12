import { get, readable, writable } from "svelte/store"

import * as contracts from './contracts'
import { ethers } from "ethers"
import { address, chainId, publicProvider, signer } from "./web3"
import _ from "lodash"

export const balance = writable(0n)
export const deposited = writable(0n)
export const isolated = writable(0n)

export type HexData = {
  allowance: bigint;
  balance: bigint;
  deposited: bigint;
  isolated: bigint;
}

export const hexData = readable<HexData>({
  allowance: 0n,
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
    if (!ethers.isAddress($address)) return
    if (ethers.ZeroAddress === $address) return
    const c = contracts.all($chainId, $publicProvider)
    const [allowance, bal, dep, iso] = await Promise.all([
      c.hex.allowance($address, await c.stakeManager.getAddress())
        .then((res) => res || 0n),
      c.hex.balanceOf($address)
        .then((res) => res || 0n),
      c.stakeManager.withdrawableBalanceOf(await c.hex.getAddress(), $address)
        .then((res) => res || 0n),
      // isolated not yet available
      0n,
    ])
    const result = {
      allowance,
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
  if (!ethers.isAddress(address)) {
    return
  }
  if (ethers.ZeroAddress === address) {
    return
  }
  const $signer = await get(signer)
  if (!$signer) return
  const c = contracts.all($chainId, $signer)
  const [bal, dep, iso] = await Promise.all([
    c.hex.balanceOf(address),
    0n,
    0n,
  ])
  balance.set(bal || (1_000n * (10n**8n)))
  deposited.set(dep)
  isolated.set(iso)
}
