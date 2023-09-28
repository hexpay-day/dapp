import _ from 'lodash'

import type * as types from '../../../../types'
import * as queries from '../../../../stores/queries'

export const load = async ({ params }: { params: { chainId: string; account: string; } }) => {
  const chainId = +params.chainId
  // let maintainable: types.StakesEndingOnDay[] = []
  // this will cause perpetuals to not show up in the list
  // because for a week, they will not have active stakes
  const perpStakes = await queries.cacheByAddress.fetch(`${chainId}-perpetuals`) as types.Stake[]
  const maintainable = await queries.cacheByAddress.fetch(`${chainId}-${params.account}`) as types.Stake[]
  // console.log(maintainable)
  return {
    chainId,
    maintainable: maintainable.concat(
      perpStakes,
    ),
  }
}
