import type * as types from '../../../../../types'
import * as graphql from '../../../../../graphql'
import _ from 'lodash'
import * as web3Store from '../../../../../stores/web3'
import * as queries from '../../../../../stores/queries'
import * as rpcQueries from '../../../../../stores/rpc-queries'
import { db } from '../../../../../db'
import { tableNames } from '../../../../../db/utils'
import { args } from '../../../../../config'
import { getByChainId } from '../../../../../stores/providers'
import type { JsonRpcProvider } from 'ethers'

export const ssr = false

const defaultResponse = ({chainId,dayParam,count}: {chainId: number, dayParam: number, count: number}) => ({
  chainId,
  stakes: [],
  day: dayParam,
  count,
})

export const load = async ({ params }: types.StakesLoadParams): Promise<types.StakesDayResponse> => {
  const chainId = +params.chainId
  const dayParam = +params.day
  const count = +params.count
  let day = dayParam
  let tmpChainId!: number
  if (!web3Store.chains.has(chainId) || chainId === 31_337) {
    let provider = getByChainId(chainId)
    if (!provider) return defaultResponse({
      chainId,
      dayParam,
      count,
    })
    const latest = await provider.getBlock('latest')
    const lastUnknown = latest?.number as number - 100_000
    const lastSolidBlock = await provider.getBlock(lastUnknown)
    for (const [chainId] of [...web3Store.chains.entries()]) {
      provider = getByChainId(chainId) as JsonRpcProvider
      const block = await provider.getBlock(lastSolidBlock?.parentHash as string)
      if (block) {
        tmpChainId = chainId
        break
      }
    }
    if (!tmpChainId) {
      return defaultResponse({
        chainId,
        dayParam,
        count,
      })
    }
  } else {
    tmpChainId = chainId
  }
  const endDay = day + count
  let all: types.StakesEndingOnDay[] = []
  do {
    const allInDay = await queries.cacheByDay.fetch(`${tmpChainId}-${day}`) as types.StakesEndingOnDay[]
    day++
    all = all.concat(allInDay)
  } while (day <= endDay);
  const stakeIds = all.map(({ stakeId }) => +stakeId)
  const hedronClient = graphql.hedronClients.get(tmpChainId)
  let hexstakes: types.HsiStatusResponse["hexstakes"] = []
  if (hedronClient) {
    const { hexstakes: hedronHexStakes } = await hedronClient.request<types.HsiStatusResponse>(graphql.queries.STAKE_HSI_STATUS, {
      stakeIds,
    })
    hexstakes = hedronHexStakes
  }
  const validHexStakeIds = _.map(hexstakes, 'stakeId')
  const signatures = await db(`${args.databaseSchema}.${tableNames.GOOD_ACCOUNT_SIGNATURE}`)
    .select('*')
    .whereIn('stakeId', validHexStakeIds)
  const hasSignatures = new Set<string>(_.map(signatures, 'stakeId'))
  const extraInfo = new Map<bigint, types.ExtraInfo>(hexstakes.map(({ stakeId, owner, hdrnHsiAddress, isHdrnHsiTokenized }) => [
    BigInt(stakeId), {
      requestedGoodAccounting: hasSignatures.has(stakeId),
      hsiAddress: hdrnHsiAddress,
      owner: owner.id.toLowerCase(),
      tokenized: isHdrnHsiTokenized,
  }]))
  const stakes = rpcQueries.toStake(all, extraInfo)
  return {
    chainId,
    stakes,
    day: dayParam,
    count: count,
  }
}
