import { writable } from 'svelte/store'
import * as ethers from 'ethers'

export const connected = writable(false)
export const chainId = writable(0)
export const address = writable(ethers.constants.AddressZero)
export const signer = writable<ethers.providers.JsonRpcSigner | null>(null)

export const provider = () => {
  return new ethers.providers.Web3Provider(window.ethereum)
}

export const facilitateConnect = async () => {
  const p = provider()
  await p.send("eth_requestAccounts", [])
  const s = p.getSigner()
  const addr = await s.getAddress()
  const chId = await s.getChainId()
  address.update(() => addr)
  signer.update(() => s)
  connected.update(() => true)
  chainId.update(() => chId)
}

export const facilitateDisconnect = async () => {
  address.update(() => ethers.constants.AddressZero)
  signer.update(() => null)
  connected.update(() => false)
}
