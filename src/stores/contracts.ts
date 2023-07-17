import type * as aTypes from '@hexpayday/stake-manager/artifacts/types'
import * as ethers from 'ethers'
import * as abis from './abis'
import * as addresses from './addresses'

import * as providers from './providers'

export const all = (chainId: number) => {
  const provider = providers.getByChainId(chainId)
  return {
    hex: new ethers.Contract(addresses.Hex, abis.IHex.abi, provider) as unknown as aTypes.IHEX,
    hsim: new ethers.Contract(addresses.HSIM, abis.IHEXStakeInstanceManager.abi, provider) as unknown as aTypes.IHEXStakeInstanceManager,
    stakeManager: new ethers.Contract(addresses.StakeManager, abis.StakeManager.abi, provider) as unknown as aTypes.StakeManager,
  }
}

// export const Hex = new ethers.Contract(addresses.Hex, abis.IHex.abi, providers.provider) as unknown as aTypes.IHEX
// export const HSIM = new ethers.Contract(addresses.HSIM, abis.IHEXStakeInstanceManager.abi, providers.provider) as unknown as aTypes.IHEXStakeInstanceManager
