import type * as types from '../../../../../types'
import * as contracts from '../../../../../stores/contracts'
import * as addresses from '../../../../../stores/addresses'
import * as graphql from '../../../../../graphql'
import type * as aTypes from '@hexpayday/stake-manager/artifacts/types/contracts/IHEX'
import _ from 'lodash'
import { LRUCache } from 'lru-cache'
import { ethers } from 'ethers'
import * as web3Store from '../../../../../stores/web3'

export const ssr = false

const getStakesFromChain = async (chainId: number, day: number) => {
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
      stakeEnd: {
        penalty: '0',
        payout: '0',
      },
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

const getAllInDay = async (chainId: number, day: number) => {
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

const options: LRUCache.Options<string, types.StakesEndingOnDay[], any> = {
  ttlAutopurge: true,
  ttl: 1_000 * 60 * 5,
  fetchMethod: async (key) => {
    const [chainId, day] = key.split('-')
    return await getAllInDay(+chainId, +day)
  },
}

const cache = new LRUCache(options)

export const load = async ({ params }: types.StakesLoadParams): Promise<types.StakesDayResponse> => {
  const chainId = +params.chainId
  const dayParam = +params.day
  const count = +params.count
  let day = dayParam
  if (!web3Store.chains.has(chainId)) {
    return {
      stakes: [],
      chainId,
      day,
      count,
    }
  }
  const endDay = day + count
  let all: types.StakesEndingOnDay[] = []
  do {
    const allInDay = await cache.fetch(`${chainId}-${day}`) as types.StakesEndingOnDay[]
    day++
    all = all.concat(allInDay)
  } while (day <= endDay);
  const stakeIds = all.map(({ stakeId }) => +stakeId)
  const hedronClient = graphql.hedronClients.get(chainId)
  let hexstakes: types.HsiStatusResponse["hexstakes"] = []
  if (hedronClient) {
    const { hexstakes: hedronHexStakes } = await hedronClient.request<types.HsiStatusResponse>(graphql.queries.STAKE_HSI_STATUS, {
      stakeIds,
    })
    hexstakes = hedronHexStakes
  }
  const hedronMapping = new Map<number, string>(hexstakes.map(({ stakeId, hdrnHsiAddress }) => [+stakeId, hdrnHsiAddress]))
  const hsiOwnerMapping = new Map<number, string>(hexstakes.map(({ stakeId, owner }) => [+stakeId, owner.id.toLowerCase()]))
  const stakes = all.map<types.Stake>((stake) => {
    const isHedron = hedronMapping.has(+stake.stakeId)
    return {
      lockedDay: +stake.startDay,
      stakedDays: +stake.stakedDays,
      stakeId: +stake.stakeId,
      isHedron,
      endDay: +stake.startDay + +stake.stakedDays,
      custodian: ethers.utils.getAddress(stake.stakerAddr),
      owner: stake.owner || (ethers.utils.getAddress(isHedron ? hsiOwnerMapping.get(+stake.stakeId) as string : stake.stakerAddr)),
    }
  })
  return {
    chainId,
    stakes,
    day: dayParam,
    count: count,
  }
}
