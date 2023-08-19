import type * as types from '../../../../../types'
import * as graphql from '../../../../../graphql'
import _ from 'lodash'
import { LRUCache } from 'lru-cache'
import { ethers } from 'ethers'
import * as web3Store from '../../../../../stores/web3'

const getAllInDay = async (chainId: number, day: number) => {
  const client = graphql.getHexByChainId(chainId)
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
  return allInDay
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
  const hedronClient = graphql.getHedronByChainId(chainId)
  let all: types.StakesEndingOnDay[] = []
  do {
    const allInDay = await cache.fetch(`${chainId}-${day}`) as types.StakesEndingOnDay[]
    day++
    all = all.concat(allInDay)
  } while (day <= endDay);
  const stakeIds = all.map(({ stakeId }) => +stakeId)
  const { hexstakes } = await hedronClient.request<types.HsiStatusResponse>(graphql.queries.STAKE_HSI_STATUS, {
    stakeIds,
  })
  const hedronMapping = new Map<number, string>(hexstakes.map(({ stakeId, hdrnHsiAddress }) => [+stakeId, hdrnHsiAddress]))
  const hsiOwnerMapping = new Map<number, string>(hexstakes.map(({ stakeId, owner }) => [+stakeId, owner.id.toLowerCase()]))
  const stakes = all.map((stake) => {
    const isHedron = hedronMapping.has(+stake.stakeId)
    return {
      lockedDay: +stake.startDay,
      stakedDays: +stake.stakedDays,
      stakeId: +stake.stakeId,
      isHedron,
      endDay: +stake.startDay + +stake.stakedDays,
      custodian: ethers.utils.getAddress(stake.stakerAddr),
      owner: ethers.utils.getAddress(isHedron ? hsiOwnerMapping.get(+stake.stakeId) as string : stake.stakerAddr),
    }
  })
  return {
    chainId,
    stakes,
    day: dayParam,
    count: count,
  }
}
