import type * as aTypes from '@hexpayday/stake-manager/artifacts/types'
import * as ethers from 'ethers'
import * as abis from './abis'
import * as addresses from './addresses'
import * as ERC20Artifact from '@hexpayday/stake-manager/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json'

import * as providers from './providers'
import type { ERC20 } from '@hexpayday/stake-manager/artifacts/types/@openzeppelin/contracts/token/ERC20'

export const all = (chainId: number, signer: null | ethers.Signer | ethers.providers.BaseProvider) => {
  const provider = providers.getByChainId(chainId)
  return {
    hex: new ethers.Contract(addresses.Hex, abis.IHex.abi, signer || provider) as unknown as aTypes.IHEX,
    hsim: new ethers.Contract(addresses.HSIM, abis.IHEXStakeInstanceManager.abi, signer || provider) as unknown as aTypes.IHEXStakeInstanceManager,
    stakeManager: new ethers.Contract(addresses.StakeManager, abis.StakeManager.abi, signer || provider) as unknown as aTypes.StakeManager,
    multicall: new ethers.Contract(addresses.Multicall, abis.Multicall.abi, signer || provider) as unknown as aTypes.IMulticall3,
    perpetual: (addr: string) => new ethers.Contract(addr, abis.Perpetual.abi, signer || provider) as unknown as aTypes.MockPerpetual,
  }
}

export const erc20 = (chainId: number, hash: string) => {
  const provider = providers.getByChainId(chainId)
  const abi = ERC20Artifact.abi
  return new ethers.Contract(hash, abi, provider) as ERC20
}

// export const Hex = new ethers.Contract(addresses.Hex, abis.IHex.abi, providers.provider) as unknown as aTypes.IHEX
// export const HSIM = new ethers.Contract(addresses.HSIM, abis.IHEXStakeInstanceManager.abi, providers.provider) as unknown as aTypes.IHEXStakeInstanceManager
