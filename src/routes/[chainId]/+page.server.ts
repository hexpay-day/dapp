import type * as types from '../../types'

export const load = async ({ params }: types.ChainIdParams): Promise<types.ChainIdResponse> => {
  return {
    chainId: +params.chainId,
  }
}
