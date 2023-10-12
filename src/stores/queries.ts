import _ from 'lodash'
import { LRUCache } from 'lru-cache'
import type * as aTypes from '@hexpayday/stake-manager/artifacts/types/contracts/interfaces/HEX'

import type * as types from '../types'
import * as contracts from './contracts'
import * as addresses from './addresses'
import * as graphql from '../graphql'
import { ethers } from 'ethers'
import { db } from '../db'
import { tableNames } from '../db/utils'
import { args } from '../config'
import * as rpcQueries from './rpc-queries'

export const getStakesFromChain = async (chainId: number, day: number) => {
  const all = contracts.all(chainId, null)
  const stakeResults = await rpcQueries.loadStakeLists(chainId, addresses.StakeManager)
  const stakes = stakeResults.map((stake) => {
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
  const ownersResult = await all.multicall.aggregate3.staticCall(callsForOwner)
  const owners = ownersResult.map((value) => `0x${value.returnData.slice(-40)}`)
  return stakes.map((stake, i) => ({
    ...stake,
    owner: owners[i],
  }))
}

export const limit = 10_000

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
    all.multicall.aggregate3.staticCall(clls)
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

export const loadStakesFromPerpetuals = async (chainId: number) => {
  const perps = [...addresses.perpetuals.values()]
  const all = contracts.all(chainId, null)
  // all this needs to be redone
  const stakes = _.compact(await Promise.all(perps.map(async (perp) => {
    const stake = await all.hex.stakeLists(perp, 0).catch((err) => null)
    if (!stake) return
    return [perp, stake] as [string, aTypes.IUnderlyingStakeable.StakeStoreStructOutput]
  })))
  return _(stakes).flatMap(([perp, stake]) => rpcQueries.toStake(rpcQueries.stakesFromResults(
    perp, perp, [stake]
  ))).value()
}

export const loadHsiFrom = async (chainId: number, account: string) => {
  const {
    stakes: stakesResults,
    all: allHsi,
    tokenizedAddresses: tokenizedHsi,
  } = await rpcQueries.loadHsiFrom(chainId, account)
  const tokenizedHsiSet = new Set(tokenizedHsi)
  const allStakeIds = _.map(stakesResults, 'stakeId')
  const requested = await db(`${args.databaseSchema}.${tableNames.GOOD_ACCOUNT_SIGNATURE}`)
    .select('*')
    .whereIn('stakeId', allStakeIds.map((stakeId) => Number(stakeId)))
  const hasRequested = new Set<string>(_.map(requested, 'stakeId'))
  const extraHsiInfo = new Map<bigint, types.ExtraInfo>(stakesResults.map((stake, index) => ([
  stake.stakeId, {
    hsiAddress: allHsi[index],
    owner: account,
    tokenized: tokenizedHsiSet.has(allHsi[index]),
    requestedGoodAccounting: hasRequested.has(`${stake.stakeId}`),
  }])))
  return _.flatMap(stakesResults, (stake, index) => (
    rpcQueries.toStake(rpcQueries.stakesFromResults(account, allHsi[index], [stake], tokenizedHsiSet.has(allHsi[index])), extraHsiInfo)
  ))
}

export const getStakesFromChainUnderAccount = async (chainId: number, account: string) => {
  const [
    resultsFromAccount,
    resultsFromStakeManager,
    resultsFromExistingStakeManager,
    hsiResults,
  ] = await Promise.allSettled([
    rpcQueries.loadStakeLists(chainId, account),
    rpcQueries.loadStakeLists(chainId, addresses.StakeManager).then(onlyOwnedBy(chainId, account, addresses.StakeManager)),
    loadHsiFrom(chainId, addresses.ExistingStakeManager),
    loadHsiFrom(chainId, account),
  ])
  const accountResults = resultsFromAccount.status === 'fulfilled' ? resultsFromAccount.value : []
  const stakeManagerResults = resultsFromStakeManager.status === 'fulfilled' ? resultsFromStakeManager.value : []
  const existingStakeManagerResults = resultsFromExistingStakeManager.status === 'fulfilled' ? resultsFromExistingStakeManager.value : []
  const hsis = hsiResults.status === 'fulfilled' ? hsiResults.value : []
  const stakeIds = _.flatMap([
    accountResults,
    stakeManagerResults,
  ], (list) => _.map(list, 'stakeId'))
  const requested = await db(`${args.databaseSchema}.${tableNames.GOOD_ACCOUNT_SIGNATURE}`)
    .select('*')
    .whereIn('stakeId', stakeIds.map((stakeId) => Number(stakeId)))
  const hasRequested = new Set<string>(_.map(requested, 'stakeId'))
  const extraData = new Map<bigint, types.ExtraInfo>(stakeIds.map((stakeId) => ([
    stakeId, {
      hsiAddress: null,
      owner: null,
      tokenized: false,
      requestedGoodAccounting: hasRequested.has(`${stakeId}`),
    }
  ])))
  return ([] as types.Stake[])
    .concat(
      rpcQueries.toStake(rpcQueries.stakesFromResults(account, account, accountResults), extraData),
      rpcQueries.toStake(rpcQueries.stakesFromResults(account, addresses.StakeManager, stakeManagerResults), extraData),
      existingStakeManagerResults,
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
  // const client = graphql.hexClients.get(chainId)
  // if (!client) {
  //   // write a multicall to get this data
  //   if (chainId === 31337) {
  //   }
  //   throw new Error('chain not supported')
  // }
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
  // return rpcQueries.toStake(allInDay.map((stake) => ({
  //   ...stake,
  //   owner: account,
  // })))
}

const optionsByAddress: LRUCache.Options<string, types.Stake[], any> = {
  ttlAutopurge: true,
  ttl: 1_000 * 20,
  fetchMethod: async (key) => {
    const [chainId, account] = key.split('-')
    if (account === 'perpetuals') {
      return await loadStakesFromPerpetuals(+chainId)
    }
    if (ethers.isAddress(account)) {
      return await getAllUnderAccount(+chainId, account)
    }
    return []
  },
}

export const cacheByAddress = new LRUCache(optionsByAddress)

const optionsByDay: LRUCache.Options<string, types.StakesEndingOnDay[], any> = {
  ttlAutopurge: true,
  ttl: 1_000 * 20,
  fetchMethod: async (key) => {
    const [chainId, day] = key.split('-')
    return await getAllInDay(+chainId, +day)
  },
}
export const cacheByDay = new LRUCache(optionsByDay)
