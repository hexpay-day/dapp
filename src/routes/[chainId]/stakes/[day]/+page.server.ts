import type * as types from '../../../../types'
import * as ethers from 'ethers'
import * as graphql from '../../../../graphql'
import _ from 'lodash'
import { getCurrentDay } from '../../../../stores/day'

export const load = async ({ params }: types.StakesLoadParams): Promise<types.StakesDayResponse> => {
  const chainId = +params.chainId
  const day = +params.day
  const client = graphql.getHexByChainId(chainId)
  const hedronClient = graphql.getHedronByChainId(chainId)
  let hasMore = true
  let all: types.StakesEndingOnDay[] = []
  const limit = 100
  do {
    const { stakeStarts } = await client.request<types.StakesEndingOnDayResponse>(graphql.queries.STAKE_STATE_ENDING_ON_DAY, {
      day,
      skip: all.length,
      limit,
    })
    all.push(...stakeStarts)
    hasMore = stakeStarts.length === limit
  } while (hasMore);
  const stakeIds = all.map(({ stakeId }) => +stakeId)
  const { hexstakes } = await hedronClient.request<types.HsiStatusResponse>(graphql.queries.STAKE_HSI_STATUS, {
    stakeIds,
  })
  const hedronMapping = new Map<number, string>(hexstakes.map(({ stakeId, hdrnHsiAddress }) => [+stakeId, hdrnHsiAddress]))
  const hsiOwnerMapping = new Map<number, string>(hexstakes.map(({ stakeId, owner }) => [+stakeId, owner.id.toLowerCase()]))
  const contract = ethers.constants.AddressZero.toLowerCase()
  const perpetuals = new Set<string>([
    '0xe9f84d418b008888a992ff8c6d22389c2c3504e0',
  ])
  const stakes = all.map((stake) => ({
    lockedDay: stake.startDay,
    stakedDays: stake.stakedDays,
    stakeId: stake.stakeId,
    isHsi: hedronMapping.has(+stake.stakeId),
    hsiAddress: hedronMapping.get(+stake.stakeId),
    isEndable: (
      stake.stakerAddr.toLowerCase() === contract
      || hsiOwnerMapping.get(+stake.stakeId) === contract
      || perpetuals.has(stake.stakerAddr.toLowerCase())
    ),
  }))
  const currentDay = await getCurrentDay()
  return {
    stakes,
    day: currentDay,
  }
}
