import type * as types from '../../../../types'
import * as graphql from '../../../../graphql'
import _ from 'lodash'

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
  const isHedronMapping = new Set<number>(hexstakes.map(({ stakeId }) => +stakeId))
  const stakes = all.map((stake) => ({
    lockedDay: stake.startDay,
    stakedDays: stake.stakedDays,
    stakeId: stake.stakeId,
    isHsi: isHedronMapping.has(+stake.stakeId),
  }))
  return {
    stakes,
  }
}
