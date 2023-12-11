import * as contracts from './contracts'
import { get, readable } from "svelte/store"
import { chainId, currentBlock, signer } from "./web3"
import { loading } from './loading'

export const allowance = readable(0n, (set) => {
  let current = 0n
  const update = async () => {
    const s = await get(signer)
    if (!s) {
      return 0n
    }
    const all = contracts.all(get(chainId), s)
    loading.increment()
    const allowance = await all.communis.allowance(
      s.address,
      await all.gcomm.getAddress(),
    ).catch(() => 0n)
    loading.decrement()
    if (cancelled) return
    if (current !== allowance) set(allowance)
  }
  let cancelled = false
  const chainIdUnsub = chainId.subscribe(update)
  const currentBlockUnsub = currentBlock.subscribe(update)
  const signerUnsub = signer.subscribe(update)
  return () => {
    cancelled = true
    chainIdUnsub()
    currentBlockUnsub()
    signerUnsub()
  }
})

export const balanceCOMM = readable(0n, (set) => {
  let current = 0n
  const update = async () => {
    const s = await get(signer)
    if (!s) {
      return 0n
    }
    const all = contracts.all(get(chainId), s)
    loading.increment()
    const balance = await all.communis.balanceOf(
      s.address,
    ).catch(() => 0n)
    loading.decrement()
    if (cancelled) return
    if (current !== balance) set(balance)
  }
  let cancelled = false
  const chainIdUnsub = chainId.subscribe(update)
  const currentBlockUnsub = currentBlock.subscribe(update)
  const signerUnsub = signer.subscribe(update)
  return () => {
    cancelled = true
    chainIdUnsub()
    currentBlockUnsub()
    signerUnsub()
  }
})

export const balanceGCOMM = readable(0n, (set) => {
  let current = 0n
  const update = async () => {
    const s = await get(signer)
    if (!s) {
      return 0n
    }
    const all = contracts.all(get(chainId), s)
    loading.increment()
    const balance = await all.gcomm.balanceOf(
      s.address,
    ).catch(() => 0n)
    loading.decrement()
    if (cancelled) return
    if (current !== balance) set(balance)
  }
  let cancelled = false
  const chainIdUnsub = chainId.subscribe(update)
  const currentBlockUnsub = currentBlock.subscribe(update)
  const signerUnsub = signer.subscribe(update)
  return () => {
    cancelled = true
    chainIdUnsub()
    currentBlockUnsub()
    signerUnsub()
  }
})
