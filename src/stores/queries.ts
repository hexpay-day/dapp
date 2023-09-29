import _ from 'lodash'
import { LRUCache } from 'lru-cache'
import type * as aTypes from '@hexpayday/stake-manager/artifacts/types/contracts/interfaces/IHEX'

import type * as types from '../types'
import * as contracts from './contracts'
import * as addresses from './addresses'
import * as graphql from '../graphql'
import { ethers } from 'ethers'
import type { IMulticall3 } from '@hexpayday/stake-manager/artifacts/types'
import { db } from '../db'
import { tableNames } from '../db/utils'

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

export const getStakesFromChain = async (chainId: number, day: number) => {
  const all = contracts.all(chainId, null)
  const stakeCount = await all.hex.stakeCount(addresses.StakeManager)
  const calls = _.range(0, stakeCount.toNumber()).map((index) => ({
    target: addresses.Hex,
    allowFailure: false,
    value: 0,
    callData: all.hex.interface.encodeFunctionData('stakeLists', [
      addresses.StakeManager,
      index,
    ]),
  }))
  const results = await all.multicall.callStatic.aggregate3(calls)
  const stakes = results.map((result) => {
    const stake = all.hex.interface.decodeFunctionResult('stakeLists', result.returnData) as unknown as aTypes.IUnderlyingStakeable.StakeStoreStructOutput
    return {
      stakeId: `${stake.stakeId}`,
      startDay: `${stake.lockedDay}`,
      stakedDays: `${stake.stakedDays}`,
      endDay: `${stake.lockedDay + stake.stakedDays}`,
      stakerAddr: addresses.StakeManager,
      stakeEnd: null,
      owner: null,
    } as types.StakesEndingOnDay
  }).filter((stake) => +stake.endDay === day)
  const callsForOwner = stakes.map((stake) => ({
    target: addresses.StakeManager,
    allowFailure: false,
    value: 0,
    callData: all.stakeManager.interface.encodeFunctionData('stakeIdToOwner', [stake.stakeId]),
  }))
  const ownersResult = await all.multicall.callStatic.aggregate3(callsForOwner)
  const owners = ownersResult.map((value) => `0x${value.returnData.slice(-40)}`)
  return stakes.map((stake, i) => ({
    ...stake,
    owner: owners[i],
  }))
}

export const limit = 10_000

export const loadStakesFrom = async (chainId: number, account: string) => {
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
    all.hex.interface.decodeFunctionResult('stakeLists', result.returnData) as unknown as aTypes.IUnderlyingStakeable.StakeStoreStructOutput
  ))
}

export const onlyOwnedBy = (chainId: number, account: string, target: string) => async (stakes: aTypes.IUnderlyingStakeable.StakeStoreStructOutput[]) => {
  const all = contracts.all(chainId, null)
  const calls = stakes.map((stake) => ({
    target,
    allowFailure: false,
    value: 0,
    callData: all.stakeManager.interface.encodeFunctionData('stakeIdToOwner', [
      stake.stakeId,
    ]),
  }))
  const stakeChunks = await Promise.all(_.chunk(calls, limit).map((clls) => (
    all.multicall.callStatic.aggregate3(clls)
  )))
  return _(stakeChunks)
    .flatten()
    .map((result, index) => (
      all.stakeManager.interface.decodeFunctionResult('stakeIdToOwner', result.returnData) as unknown as string === account
        ? stakes[index]
        : null
    ))
    .compact()
    .value()
}

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

export const loadStakesFromPerpetuals = async (chainId: number) => {
  const perps = [...addresses.perpetuals.values()]
  const all = contracts.all(chainId, null)
  // all this needs to be redone
  const stakes = _.compact(await Promise.all(perps.map(async (perp) => {
    const stake = await all.hex.stakeLists(perp, 0).catch((err) => null)
    if (!stake) return
    return [perp, stake] as [string, aTypes.IUnderlyingStakeable.StakeStoreStructOutput]
  })))
  return _(stakes).flatMap(([perp, stake]) => toStake(stakesFromResults(
    perp, perp, [stake]
  ))).value()
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
  const [hsiCount, tokenCount] = countResults.map((result) => BigInt(result.returnData))
  const hsiStakeCalls = _.range(0, Number(hsiCount)).map((index) => (
    callHsim(all.hsim.interface.encodeFunctionData('hsiLists', [
      account,
      index,
    ]))
  ))
  const tokenCalls = _.range(0, Number(tokenCount)).map((index) => (
    callHsim(all.hsim.interface.encodeFunctionData('tokenOfOwnerByIndex', [
      account,
      index,
    ]))
  ))
  const allCalls = hsiStakeCalls.concat(tokenCalls)
  const allResults = await all.multicall.callStatic.aggregate3(allCalls)
  const [hsiStakeResults, tokenResults] = _.partition(allResults, (a: any, index: any) => index < hsiStakeCalls.length) as [
    IMulticall3.ResultStructOutput[],
    IMulticall3.ResultStructOutput[],
  ]
  const hsiStakes = hsiStakeResults.map((result) => ethers.utils.getAddress(`0x${result.returnData.slice(-40)}`))
  const tokenIds = tokenResults.map((result) => BigInt(result.returnData))
  const tokenHsiCalls = tokenIds.map((tokenId) => (
    callHsim(all.hsim.interface.encodeFunctionData('hsiToken', [tokenId]))
  ))
  const tokenHsiResults = tokenHsiCalls ? await all.multicall.callStatic.aggregate3(tokenHsiCalls) : [] as IMulticall3.ResultStructOutput[]
  const tokenizedHsi = tokenHsiResults.map((result) => ethers.utils.getAddress(`0x${result.returnData.slice(-40)}`))
  const allHsi = hsiStakes.concat(tokenizedHsi)
  const stakeListCalls = allHsi.map((hsi) => callHex(
    all.hex.interface.encodeFunctionData('stakeLists', [hsi, 0])
  ))
  const stakeListsResults = await all.multicall.callStatic.aggregate3(stakeListCalls)
  const stakesResults = stakeListsResults.map((result) => all.hex.interface.decodeFunctionResult('stakeLists', result.returnData) as unknown as aTypes.IUnderlyingStakeable.StakeStoreStructOutput)
  const tokenizedHsiSet = new Set(tokenizedHsi)
  const allStakeIds = _.map(stakesResults, 'stakeId')
  const requested = await db(tableNames.GOOD_ACCOUNT_SIGNATURE)
    .select('*')
    .whereIn('stakeId', allStakeIds)
  const hasRequested = new Set<string>(_.map(requested, 'stakeId'))
  const extraHsiInfo = new Map<number, types.ExtraInfo>(stakesResults.map((stake, index) => ([
  +stake.stakeId, {
    hsiAddress: allHsi[index],
    owner: account,
    tokenized: tokenizedHsiSet.has(allHsi[index]),
    requestedGoodAccounting: hasRequested.has(`${stake.stakeId}`),
  }])))
  return _.flatMap(stakesResults, (stake, index) => (
    toStake(stakesFromResults(account, allHsi[index], [stake], tokenizedHsiSet.has(allHsi[index])), extraHsiInfo)
  ))
}

export const getStakesFromChainUnderAccount = async (chainId: number, account: string) => {
  const [
    resultsFromAccount,
    resultsFromStakeManager,
    // resultsFromExistingStakeManager,
    hsis,
  ] = await Promise.all([
    loadStakesFrom(chainId, account),
    loadStakesFrom(chainId, addresses.StakeManager).then(onlyOwnedBy(chainId, account, addresses.StakeManager)),
    // loadStakesFrom(chainId, addresses.ExistingStakeManager).then(onlyOwnedBy(chainId, account, addresses.ExistingStakeManager)),
    loadHsiFrom(chainId, account),
  ])
  const stakeIds = _.flatMap([
    resultsFromAccount,
    resultsFromStakeManager,
    // resultsFromExistingStakeManager,
  ], (list) => _.map(list, 'stakeId'))
  const requested = await db(tableNames.GOOD_ACCOUNT_SIGNATURE)
    .select('*')
    .whereIn('stakeId', stakeIds)
  const hasRequested = new Set<string>(_.map(requested, 'stakeId'))
  const extraData = new Map<number, types.ExtraInfo>(stakeIds.map((stakeId) => ([
    stakeId, {
      hsiAddress: null,
      owner: null,
      tokenized: false,
      requestedGoodAccounting: hasRequested.has(`${stakeId}`),
    }
  ])))
  return ([] as types.Stake[])
    .concat(
      toStake(stakesFromResults(account, account, resultsFromAccount), extraData),
      toStake(stakesFromResults(account, addresses.StakeManager, resultsFromStakeManager), extraData),
      // toStake(stakesFromResults(account, addresses.ExistingStakeManager, resultsFromExistingStakeManager)),
      hsis,
    )
}

export const getAllInDay = async (chainId: number, day: number) => {
  const client = graphql.hexClients.get(chainId)
  if (!client) {
    // write a multicall to get this data
    if (chainId === 31337) {
      return await getStakesFromChain(chainId, day)
    }
    throw new Error('chain not supported')
  }
  const allInDay: types.StakesEndingOnDay[] = []
  let hasMore = false
  const limit = 100
  do {
    const response = await client.request<types.StakesEndingOnDayResponse>(graphql.queries.STAKE_STATE_ENDING_ON_DAY, {
      day,
      skip: allInDay.length,
      limit,
    })
    const { stakeStarts } = response
    allInDay.push(...stakeStarts)
    hasMore = stakeStarts.length === limit
  } while (hasMore);
  return allInDay.map((stake) => ({
    ...stake,
    owner: null,
  }))
}

export const getAllUnderAccount = async (chainId: number, account: string) => {
  const client = graphql.hexClients.get(chainId)
  if (!client) {
    // write a multicall to get this data
    if (chainId === 31337) {
    }
    throw new Error('chain not supported')
  }
  return await getStakesFromChainUnderAccount(chainId, account)
  // const allInDay: types.StakesEndingOnDay[] = []
  // let hasMore = false
  // const limit = 100
  // do {
  //   // only does hex - still need stake manager
  //   const response = await client.request<types.StakesEndingOnDayResponse>(graphql.queries.STAKES_UNDER_ACCOUNT, {
  //     account,
  //   })
  //   const { stakeStarts } = response
  //   allInDay.push(...stakeStarts)
  //   hasMore = stakeStarts.length === limit
  // } while (hasMore);
  // return toStake(allInDay.map((stake) => ({
  //   ...stake,
  //   owner: account,
  // })))
}

const optionsByAddress: LRUCache.Options<string, types.Stake[], any> = {
  ttlAutopurge: true,
  ttl: 1_000 * 60 * 5,
  fetchMethod: async (key) => {
    const [chainId, day] = key.split('-')
    if (day === 'perpetuals') {
      return await loadStakesFromPerpetuals(+chainId)
    }
    if (ethers.utils.isAddress(day)) {
      return await getAllUnderAccount(+chainId, day)
    }
    return []
  },
}

export const cacheByAddress = new LRUCache(optionsByAddress)

const optionsByDay: LRUCache.Options<string, types.StakesEndingOnDay[], any> = {
  ttlAutopurge: true,
  ttl: 1_000 * 60 * 5,
  fetchMethod: async (key) => {
    const [chainId, day] = key.split('-')
    return await getAllInDay(+chainId, +day)
  },
}
export const cacheByDay = new LRUCache(optionsByDay)
