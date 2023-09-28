import type * as types from '../../../../../types'
import * as graphql from '../../../../../graphql'
import _ from 'lodash'
import * as web3Store from '../../../../../stores/web3'
import * as queries from '../../../../../stores/queries'

export const ssr = false

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
    const allInDay = await queries.cacheByDay.fetch(`${chainId}-${day}`) as types.StakesEndingOnDay[]
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
  const extraInfo = new Map<number, types.ExtraInfo>(hexstakes.map(({ stakeId, owner, hdrnHsiAddress, isHdrnHsiTokenized }) => [
    +stakeId, {
    hsiAddress: hdrnHsiAddress,
    owner: owner.id.toLowerCase(),
    tokenized: isHdrnHsiTokenized,
  }]))
  const stakes = queries.toStake(all, extraInfo)
  return {
    chainId,
    stakes,
    day: dayParam,
    count: count,
  }
}
