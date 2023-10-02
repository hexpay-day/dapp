import { derived, get, readable, writable } from 'svelte/store'
import { readable as readablePromise } from './promise-store'
import * as ethers from 'ethers'
import type { SwitchChainError } from 'viem'
import { mainnet, pulsechain, pulsechainV4, hardhat } from '@wagmi/chains'
import type { Chain } from '@wagmi/core'
import _ from 'lodash'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import type { sequence } from '0xsequence'

export const chains = new Map<number, Chain>([
  [1, mainnet],
  [369, pulsechain],
  [943, pulsechainV4],
  [31337, hardhat],
])

export const windowIsAvailable = readable(typeof window !== 'undefined')
export const intendsToConnect = writable(false)
export const clickedConnect = writable(false)
export const chainId = writable(0)

export const replaceUrl = ($chainId: number, path: string) => {
  const [empty, cId, ...remaining] = path.split('/')
  if (!cId || !(+cId) || !remaining.length) {
    // not sure how to handle
    return `/${$chainId}/`
  }
  const url = `${[empty, $chainId, ...remaining].join('/')}`
  return url
}
let setProvider: () => void
const underlyingProvider = readable<null | ethers.providers.ExternalProvider>(null, (set) => {
  if (!get(windowIsAvailable)) {
    return () => {}
  }
  let underlying!: ethers.providers.ExternalProvider
  let rem!: () => void
  const providerNetworkSwitched = async (cId: string) => {
    const $chainId = parseInt(cId)
    const url = replaceUrl($chainId, get(page).url.pathname)
    chainId.set($chainId)
    await goto(url, {
      keepFocus: true,
      replaceState: true,
      noScroll: true,
      invalidateAll: true,
    })
  }
  const teardown = () => {
    if (!underlying) return
    try {
      // @ts-ignore
      underlying.removeListener('chainChanged', providerNetworkSwitched)
      rem?.()
    } catch (err) {}
  }
  const setup = () => {
    try {
      // @ts-ignore
      if (get(clickedConnect) && !get(intendsToConnect)) {
        return
      }
      (underlying as any).addListener('chainChanged', providerNetworkSwitched)
      // intendsToConnect.set((underlying as any).isConnected())
    } catch (err) {}
  }
  setProvider = () => {
    teardown()
    underlying = window.ethereum
    if (underlying) {
      // console.log('updating provider', +(underlying as any).networkVersion)
      setup()
    }
    set(underlying)
  }
  const id = setInterval(() => {
    setProvider()
    if (underlying) {
      clearInterval(id)
    }
  }, 1_000)
  intendsToConnect.subscribe(setProvider)
  return () => {
    clearInterval(id)
  }
})
export const connectable = derived([underlyingProvider], ([$underlyingProvider]) => !!$underlyingProvider)
const mmChainId = ($underlyingProvider: null | ethers.providers.ExternalProvider) => {
  return +($underlyingProvider as any)?.networkVersion
}
export const provider = derived(
  [underlyingProvider, intendsToConnect, chainId], (
  [$underlyingProvider, $intendsToConnect, $chainId]
) => {
  if (!$underlyingProvider || !$chainId || !$intendsToConnect) return null
  return new ethers.providers.Web3Provider($underlyingProvider)
})
export const publicProvider = derived([chainId], ([$chainId]) => {
  if ($chainId) {
    const chain = chains.get($chainId)
    if (chain) {
      return new ethers.providers.JsonRpcProvider(chain.rpcUrls.public.http[0], $chainId)
    }
  }
  return null
})
export const signer = derived([provider], ([$provider]) => {
  if (!$provider) return null
  return $provider.getSigner()
})
export const address = readablePromise<string>(ethers.constants.AddressZero, derived([provider, chainId], async ([$provider, $chainId]) => {
  if (!$provider || !$chainId) {
    return ethers.constants.AddressZero
  }
  const accounts = await $provider.send("eth_requestAccounts", [])
  const account = accounts.length && accounts[0]
  return _.isString(account) ? ethers.utils.getAddress(account) : ethers.constants.AddressZero
}))
export const connected = derived(
  [intendsToConnect, chainId, address],
  ([$intendsToConnect, $chainId, $address]) => {
    // console.log($intendsToConnect, $chainId, $address)
    return $intendsToConnect && $chainId as number > 0 && $address !== ethers.constants.AddressZero
  },
)

export const currentBlock = readable<null | ethers.providers.Block>(null, (set) => {
  let id: any
  const retrieve = async ($prov: null | ethers.providers.JsonRpcProvider) => {
    if (!$prov) return
    const loop = async () => {
      const block = await $prov.getBlock('latest').catch(() => null)
      if (block) set(block)
      id = setTimeout(loop, 5_000)
    }
    loop()
  }
  const unsub = publicProvider.subscribe(retrieve)
  return () => {
    unsub()
    clearTimeout(id)
  }
})

export const secondsToIso = (timestamp = 0) => {
  return new Date((timestamp || 0) * 1_000).toISOString().split('.000').join('')
}

export const changeNetworks = async (requestedChainId: number) => {
  const p = get(provider)
  if (!p) return
  const target = chains.get(requestedChainId) as Chain
  const reqCIdAsHex = `0x${requestedChainId.toString(16)}`
  const isHH = target.id === 31337
  try {
    await p.send('wallet_switchEthereumChain', [{
      chainId: reqCIdAsHex,
    }])
  } catch (err) {
    const switchError = err as SwitchChainError
    if (switchError.code === 4902) {
      try {
        await p.send('wallet_addEthereumChain', [
          {
            chainId: reqCIdAsHex,
            chainName: target.name,
            nativeCurrency: target.nativeCurrency,
            blockExplorerUrls: isHH ? null : [
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
  // chainId.set(requestedChainId)
  const $provider = get(provider)
  // quick test to ensure underlying matches
  await $provider?.getNetwork()
    .catch(() => {
      // underlying network does not match
      // setProvider()
    })
    .then(() => {
      setProvider()
    })
}

export const facilitateConnect = async (requestedChainId: number) => {
  intendsToConnect.set(true)
  const $chainId = get(chainId)
  if ($chainId !== requestedChainId || requestedChainId !== mmChainId(get(underlyingProvider))) {
    await changeNetworks(requestedChainId).catch(() => {})
  }
}

export const facilitateDisconnect = async () => {
  clickedConnect.set(true)
  intendsToConnect.set(false)
}

const defaultDelimiter = ','

export const numberWithCommas = (x: string, delimiter = defaultDelimiter) => x.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/ugim, delimiter)

export const sign712Message = async (typedRequest: sequence.utils.TypedData) => {
  const $signer = get(signer)
  if (!$signer) return
  return $signer._signTypedData(typedRequest.domain, typedRequest.types, typedRequest.message)
}

// export const create712Message = {
//   requestGoodAccount: ({
//     chainId,
//     stakeId,
//   }: {
//     chainId: number;
//     stakeId: number;
//   }): sequence.utils.TypedData => ({
//     types: {
//       Stake: [
//         { name: 'stakeId', type: 'uint256', },
//       ],
//     },
//     primaryType: 'Stake' as const,
//     domain: {
//       name: 'HexPay.Day',
//       version: '1',
//       chainId,
//       verifyingContract: ethers.constants.AddressZero,
//     },
//     message: {
//       // the owner of this stake id must be the address
//       // that signs this object
//       stakeId,
//     },
//   }),
// }

export const structOutputToObject = (struct: object) => {
  return _(struct).entries().reduce((obj, [key, entry]) => {
    if (_.isNaN(+key)) {
      let value = _.isArrayLike(entry) ? structOutputToObject(entry) : entry
      if (value._isBigNumber) {
        value = value.toBigInt()
      }
      obj[key] = value
    }
    return obj
  }, {} as Record<string, any>)
}
