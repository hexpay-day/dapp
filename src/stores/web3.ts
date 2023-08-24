import { get, writable } from 'svelte/store'
import * as ethers from 'ethers'
import type { SwitchChainError } from 'viem'
import { mainnet, pulsechain, pulsechainV4 } from '@wagmi/chains'
import type { Chain } from '@wagmi/core'
import { fetchData } from './hex'

export const connectable = writable(false)
export const connected = writable(false)
export const chainId = writable<number>(0)
export const address = writable<string>(ethers.constants.AddressZero)
export const signer = writable<ethers.providers.JsonRpcSigner | null>(null)
export const currentBlock = writable<ethers.providers.Block | null>(null)

const id = setInterval(() => {
  if (typeof window === 'undefined') return
  connectable.set(!!window.ethereum)
  clearInterval(id)
}, 1_000)

export const setChainIdIfNot = (cId: number) => {
  if (get(chainId) || !chains.has(cId)) {
    return
  }
  chainId.set(cId)
}

export const chains = new Map<number, Chain>([
  [1, mainnet],
  [369, pulsechain],
  [943, pulsechainV4],
])

export const rpcs = new Map<number, string>([
  [1, 'https://eth.llamarpc.com'],
  [369, 'https://rpc.pulsechain.com'],
  [943, 'https://rpc.v4.testnet.pulsechain.com'],
])

export const provider = () => {
  if (!get(connectable)) {
    return
  }
  return new ethers.providers.Web3Provider(window.ethereum)
}

export const secondsToIso = (timestamp = 0) => {
  return new Date((timestamp || 0) * 1_000).toISOString().split('.000').join('')
}

export const changeNetworks = async (requestedChainId: number) => {
  const p = provider()
  if (!p) return
  const target = chains.get(requestedChainId) as Chain
  const chainId = `0x${requestedChainId.toString(16)}`
  try {
    await p.send('wallet_switchEthereumChain', [{
      chainId,
    }])
  } catch (err) {
    const switchError = err as SwitchChainError
    if (switchError.code === 4902) {
      try {
        console.log(target)
        await p.send('wallet_addEthereumChain', [
          {
            chainId,
            chainName: target.name,
            nativeCurrency: target.nativeCurrency,
            blockExplorerUrls: [
              target.blockExplorers?.default.url,
            ],
            rpcUrls: [
              ...target.rpcUrls.public.http,
              ...(target.rpcUrls.public?.webSocket || []),
            ],
          },
        ]);
      } catch (addError) {
        console.log(addError)
        // handle "add" error
        throw addError
      }
    }
  }
  await facilitateConnect()
}

const startPolling = (fn: () => any, ms = 3_000) => {
  let id = 0
  return async () => {
    ++id
    const i = id
    const runner = async () => {
      if (i !== id) {
        return
      }
      const cancel = await fn()
      if (!cancel) {
        setTimeout(runner, ms)
      }
    }
    await runner()
  }
}

const updateNetworkInfo = async () => {
  const s = get(signer)
  const block = await s?.provider.getBlock('latest')
  if (!block) {
    return true
  }
  currentBlock.set(block)
}

const fetchNetworkInfo = startPolling(updateNetworkInfo)

export const facilitateConnect = async () => {
  const p = provider()
  if (!p) return
  await p.send("eth_requestAccounts", [])
  const s = p.getSigner()
  const addr = await s.getAddress()
  const chId = await s.getChainId()
  signer.set(s)
  address.set(addr)
  connected.set(true)
  chainId.set(chId)
  await Promise.all([
    fetchNetworkInfo(),
    fetchData(chId, addr),
  ])
}

export const facilitateDisconnect = async () => {
  address.set(ethers.constants.AddressZero)
  signer.set(null)
  connected.set(false)
}
export const intWithCommas = (x: bigint | number, delimiter = '_') => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
}