import { get, writable } from 'svelte/store'
import * as ethers from 'ethers'

export const connected = writable(false)
export const chainId = writable<number>(0)
export const address = writable<string>(ethers.constants.AddressZero)
export const signer = writable<ethers.providers.JsonRpcSigner | null>(null)

export const chains = new Map<number, string>([
  [1, 'Ethereum'],
  [369, 'Pulsechain'],
  [943, 'Pulsechain Testnet'],
])

export const provider = () => {
  return new ethers.providers.Web3Provider(window.ethereum)
}

export const facilitateConnect = async () => {
  const p = provider()
  await p.send("eth_requestAccounts", [])
  const s = p.getSigner()
  const addr = await s.getAddress()
  const chId = await s.getChainId()
  address.set(addr)
  signer.set(s)
  connected.set(true)
  chainId.set(chId)
}

export const facilitateDisconnect = async () => {
  address.set(ethers.constants.AddressZero)
  signer.set(null)
  connected.set(false)
}
