import type * as aTypes from '@hexpayday/stake-manager/artifacts/types'
import type * as iTypes from '@hexpayday/stake-manager/artifacts/types/contracts/interfaces'
import type * as gTypes from '@hexpayday/gigacommunis/artifacts/types'
import * as ERC20Artifact from '@hexpayday/stake-manager/artifacts/solmate/src/tokens/ERC20.sol/ERC20.json'
import type { ERC20 } from '@hexpayday/stake-manager/artifacts/types/solmate/src/tokens/ERC20'
import * as ethers from 'ethers'
import * as abis from './abis'
import * as addresses from './addresses'

import * as types from '../types'
import * as providers from './providers'

export const all = (
  chainId: number,
  signer: null | ethers.Signer | ethers.Provider,
) => {
  const provider = providers.getByChainId(chainId)
  const connection = signer || provider
  return {
    hex: new ethers.Contract(addresses.Hex, abis.IHex.abi, connection) as unknown as aTypes.HEX,
    hsim: new ethers.Contract(addresses.HSIM, abis.IHEXStakeInstanceManager.abi, connection) as unknown as aTypes.HEXStakeInstanceManager,
    stakeManager: new ethers.Contract(addresses.StakeManager, abis.StakeManager.abi, connection) as unknown as aTypes.StakeManager,
    existingStakeManager: new ethers.Contract(addresses.ExistingStakeManager, abis.ExistingStakeManager.abi, connection) as unknown as aTypes.ExistingStakeManager,
    multicall: new ethers.Contract(addresses.Multicall, abis.Multicall.abi, connection) as unknown as aTypes.Multicall,
    perpetual: (addr: string) => new ethers.Contract(addr, abis.Perpetual.abi, connection) as unknown as aTypes.MockPerpetual,
    communis: new ethers.Contract(addresses.Communis, abis.Communis.abi, connection) as unknown as iTypes.Communis,
    gcomm: new ethers.Contract(addresses.GigaCommunis, abis.GigaCommunis.abi, connection) as unknown as gTypes.GigaCommunis,
  }
}

export const erc20 = (chainId: number, hash: string) => {
  const provider = providers.getByChainId(chainId)
  const abi = ERC20Artifact.abi
  return new ethers.Contract(hash, abi, provider) as unknown as ERC20
}

export const options = {
  perpetuals: [
    types.TimelineTypes.END,
    // types.TimelineTypes.START,
    types.TimelineTypes.GOOD_ACCOUNT,
  ],
  hsi: [
    types.TimelineTypes.TOKENIZE_HSI,
    types.TimelineTypes.DEPOSIT_HSI,
    types.TimelineTypes.WITHDRAW_HSI,
    types.TimelineTypes.GOOD_ACCOUNT,
    types.TimelineTypes.RESTART_STAKE,
    types.TimelineTypes.START,
    types.TimelineTypes.END,
    types.TimelineTypes.UPDATE,
  ],
  notOwned: {
    hsi: [
      types.TimelineTypes.GOOD_ACCOUNT,
      types.TimelineTypes.END,
    ],
    perpetuals: [
      types.TimelineTypes.GOOD_ACCOUNT,
      types.TimelineTypes.END,
    ],
  },
}
