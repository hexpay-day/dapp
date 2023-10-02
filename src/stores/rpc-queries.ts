import type * as types from '../types'
import * as ethers from 'ethers'
import _ from 'lodash'
import type * as aTypes from '@hexpayday/stake-manager/artifacts/types/contracts/interfaces/IHEX'
import * as contracts from './contracts'
import * as addresses from './addresses'
import type { IMulticall3 } from '@hexpayday/stake-manager/artifacts/types'

export const toStake = (
  all: types.StakesEndingOnDay[],
  extraInfo = new Map<number, types.ExtraInfo>(),
) => all.map<types.Stake>((stake) => {
  const extra = extraInfo.get(+stake.stakeId)
  const isHedron = !!extra && !!extra.hsiAddress
  return {
    lockedDay: +stake.startDay,
    stakedDays: +stake.stakedDays,
    stakeId: +stake.stakeId,
    isHedron: !!extra?.hsiAddress,
    tokenized: !!extra?.tokenized,
    requestedGoodAccounting: !!extra?.requestedGoodAccounting,
    endDay: +stake.startDay + +stake.stakedDays,
    custodian: ethers.utils.getAddress(stake.stakerAddr),
    owner: stake.owner || (ethers.utils.getAddress(isHedron ? extra.owner as string : stake.stakerAddr)),
  }
})

export const stakesFromResults = (account: string, stakerAddr: string, list: aTypes.IUnderlyingStakeable.StakeStoreStructOutput[], tokenized = false) => {
  return list.map((stake) => {
    return {
      stakeId: `${stake.stakeId}`,
      startDay: `${stake.lockedDay}`,
      stakedDays: `${stake.stakedDays}`,
      endDay: `${stake.lockedDay + stake.stakedDays}`,
      stakerAddr,
      stakeEnd: null,
      owner: account,
      tokenized,
    } as types.StakesEndingOnDay
  })
}

export const getTokenIdsUnder = async (chainId: number, $account: string) => {
  const all = contracts.all(chainId, null)
  const tokenizedHsiCount = await all.hsim.balanceOf($account)
  const tokenizedHsiCalls = _.range(0, tokenizedHsiCount.toNumber()).map((index) => ({
    value: 0,
    target: addresses.HSIM,
    allowFailure: false,
    callData: all.hsim.interface.encodeFunctionData('tokenOfOwnerByIndex', [
      $account, index,
    ]),
  }))
  const tokenResults = await all.multicall.callStatic.aggregate3(tokenizedHsiCalls)
  return tokenResults.map((result) => (
    (all.hsim.interface.decodeFunctionResult('tokenOfOwnerByIndex', result.returnData)[0] as ethers.BigNumber).toBigInt()
  ))
}

export const getCustodianToTokenIds = async (chainId: number, tokenIds: bigint[]) => {
  const all = contracts.all(chainId, null)
  const hsiAddressesCalls = tokenIds.map((token) => ({
    value: true,
    allowFailure: false,
    target: addresses.HSIM,
    callData: all.hsim.interface.encodeFunctionData('hsiToken', [token]),
  }))
  const hsiAddresesResults = await all.multicall.callStatic.aggregate3(hsiAddressesCalls)
  const hsiAddresses = hsiAddresesResults.map((result) => (
    ethers.utils.getAddress(all.hsim.interface.decodeFunctionResult('hsiToken', result.returnData)[0] as string)
  ))
  return new Map<string, bigint>(_.zip(hsiAddresses, tokenIds) as [string, bigint][])
}

export const limit = 1_000

export const loadStakeLists = async (chainId: number, account: string) => {
  const all = contracts.all(chainId, null)
  const stakeCount = await all.hex.stakeCount(account)
  const calls = _.range(0, stakeCount.toNumber()).map((index) => ({
    target: addresses.Hex,
    allowFailure: false,
    value: 0,
    callData: all.hex.interface.encodeFunctionData('stakeLists', [
      account,
      index,
    ]),
  }))
  const stakeChunks = await Promise.all(_.chunk(calls, limit).map((clls) => (
    all.multicall.callStatic.aggregate3(clls)
  )))
  return _.flatten(stakeChunks).map((result) => (
    all.hex.interface.decodeFunctionResult('stakeLists', result.returnData)[0] as unknown as aTypes.IUnderlyingStakeable.StakeStoreStructOutput
  ))
}

export const loadHsiFrom = async (chainId: number, account: string) => {
  const createCall = (target: string) => (callData: string) => ({
    target,
    value: 0,
    allowFailure: false,
    callData,
  })
  const callHsim = createCall(addresses.HSIM)
  const callHex = createCall(addresses.Hex)
  const all = contracts.all(chainId, null)
  const countCalls = [
    callHsim(all.hsim.interface.encodeFunctionData('hsiCount', [account])),
    callHsim(all.hsim.interface.encodeFunctionData('balanceOf', [account])),
  ]
  const countResults = await all.multicall.callStatic.aggregate3(countCalls)
  const [detokenizedCount, tokenizedCount] = countResults.map((result) => BigInt(result.returnData))
  const detokenizedCalls = _.range(0, Number(detokenizedCount)).map((index) => (
    callHsim(all.hsim.interface.encodeFunctionData('hsiLists', [
      account,
      index,
    ]))
  ))
  const tokenizedCalls = _.range(0, Number(tokenizedCount)).map((index) => (
    callHsim(all.hsim.interface.encodeFunctionData('tokenOfOwnerByIndex', [
      account,
      index,
    ]))
  ))
  const allCalls = detokenizedCalls.concat(tokenizedCalls)
  const allResults = await all.multicall.callStatic.aggregate3(allCalls)
  // for whatever reason, index is not given during partition
  const detokenizedStakes = allResults.slice(0, detokenizedCalls.length) as IMulticall3.ResultStructOutput[]
  const tokenizedStakes = allResults.slice(detokenizedCalls.length) as IMulticall3.ResultStructOutput[]
  const detokenizedAddresses = detokenizedStakes.map((result) => ethers.utils.getAddress(`0x${result.returnData.slice(-40)}`))
  const tokenIds = tokenizedStakes.map((result) => BigInt(result.returnData))
  const tokenHsiCalls = tokenIds.map((tokenId) => (
    callHsim(all.hsim.interface.encodeFunctionData('hsiToken', [tokenId]))
  ))
  const tokenHsiResults = tokenHsiCalls ? await all.multicall.callStatic.aggregate3(tokenHsiCalls) : [] as IMulticall3.ResultStructOutput[]
  const tokenizedHsi = tokenHsiResults.map((result) => ethers.utils.getAddress(`0x${result.returnData.slice(-40)}`))
  const allHsi = detokenizedAddresses.concat(tokenizedHsi)
  const stakeListCalls = allHsi.map((hsi) => callHex(
    all.hex.interface.encodeFunctionData('stakeLists', [hsi, 0])
  ))
  const stakeListsResults = await all.multicall.callStatic.aggregate3(stakeListCalls)
  const stakesResults = stakeListsResults.map((result) => (all.hex.interface.decodeFunctionResult('stakeLists', result.returnData))[0] as unknown as aTypes.IUnderlyingStakeable.StakeStoreStructOutput)
  return {
    stakes: stakesResults,
    all: allHsi,
    detokenizedAddresses,
    tokenizedAddresses: tokenizedHsi,
  } as const
}
