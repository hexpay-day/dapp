import { get, writable } from 'svelte/store'
import * as ethers from 'ethers'

export const connected = writable(false)
export const chainId = writable<number>(0)
export const address = writable<string>(ethers.constants.AddressZero)
export const signer = writable<ethers.providers.JsonRpcSigner | null>(null)
export const currentBlock = writable<ethers.providers.Block | null>(null)

export const chains = new Map<number, string>([
  [1, 'Ethereum'],
  [369, 'Pulsechain'],
  [943, 'Pulsechain Testnet'],
])

export const provider = () => {
  return new ethers.providers.Web3Provider(window.ethereum)
}

export const secondsToIso = (timestamp = 0) => {
  return new Date((timestamp || 0) * 1_000).toISOString().split('.000').join('')
}

const startPolling = async (fn: () => any, ms = 3_000) => {
  const runner = async () => {
    const cancel = await fn()
    if (!cancel) {
      setTimeout(runner, ms)
    }
  }
  await runner()
}

const updateNetworkInfo = async () => {
  const s = get(signer)
  const block = await s?.provider.getBlock('latest')
  if (!block) {
    return true
  }
  currentBlock.set(block)
}

export const facilitateConnect = async () => {
  const p = provider()
  await p.send("eth_requestAccounts", [])
  const s = p.getSigner()
  const addr = await s.getAddress()
  const chId = await s.getChainId()
  signer.set(s)
  address.set(addr)
  connected.set(true)
  chainId.set(chId)
  await startPolling(updateNetworkInfo)
}

export const facilitateDisconnect = async () => {
  address.set(ethers.constants.AddressZero)
  signer.set(null)
  connected.set(false)
}
