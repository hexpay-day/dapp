import * as queries from '../../../stores/queries'
import type * as types from '../../../types'

export const load = async ({ params }: { params: { chainId: string } }) => {
  const chainId = +params.chainId || 1
  const perpetuals = await queries.cacheByAddress.fetch(`${chainId}-perpetuals`).catch(() => [] as types.Stake[])
  return {
    chainId,
    perpetuals,
  }
}
