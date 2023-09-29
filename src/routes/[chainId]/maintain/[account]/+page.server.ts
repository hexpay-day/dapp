import _ from 'lodash'
import type { Actions } from "@sveltejs/kit";
import * as backendClient from '../../../../stores/backend'
import * as graphqlStore from '../../../../graphql'

import type * as types from '../../../../types'
import * as queries from '../../../../stores/queries'
import { sequence } from '0xsequence';
import { getByChainId } from '../../../../stores/providers';
import { db } from '../../../../db';
import { tableNames } from '../../../../db/utils';
import { ethers } from 'ethers';
import { args } from '../../../../config';

export const load = async ({ params }: { params: { chainId: string; account: string; } }) => {
  const chainId = +params.chainId
  // let maintainable: types.StakesEndingOnDay[] = []
  // this will cause perpetuals to not show up in the list
  // because for a week, they will not have active stakes
  const perpStakes = await queries.cacheByAddress.fetch(`${chainId}-perpetuals`) as types.Stake[]
  const maintainable = await queries.cacheByAddress.fetch(`${chainId}-${params.account}`) as types.Stake[]
  return {
    chainId,
    maintainable: maintainable.concat(
      perpStakes,
    ),
  }
}

export const actions: Actions = {
  'good-account': async (a) => {
    const reader = a.request.body?.getReader()
    const data = await reader?.read()
    const request = JSON.parse(data?.value?.toString() as string) as backendClient.StoreSignaturePayload
    const chainId = +(a.params.chainId as string)
    const account = a.params.account as string
    const typedRequest = backendClient.create712Message.requestGoodAccount({
      chainId,
      stakeId: request.stakeId,
      validStart: request.validStart,
      validUntil: request.validUntil,
    })
    const provider = getByChainId(chainId)
    const result = await sequence.utils.isValidTypedDataSignature(account, typedRequest, request.signature, provider)
    if (!result) {
      return { success: false, message: 'invalid signature' }
    }
    // check that address owns stake
    const hexGraphql = graphqlStore.getHexByChainId(chainId)
    type OwnerOfRequest = {
      stakeStarts: {
        stakeId: string;
        stakerAddr: string;
        stakeEnd: null | {
          payout: string;
          penalty: string;
        };
        stakeGoodAccounting: null | {
          payout: string;
          penalty: string;
        };
      }[];
    }
    const { stakeStarts: [stakeData] } = await hexGraphql.request<OwnerOfRequest>(graphqlStore.queries.OWNER_OF, {
      stakeId: request.stakeId,
    })
    if (!stakeData || !stakeData.stakeId || stakeData.stakeGoodAccounting || stakeData.stakeEnd) {
      return { success: false, message: 'data check', data: stakeData }
    }
    if (ethers.utils.getAddress(stakeData.stakerAddr) !== ethers.utils.getAddress(account)) {
      const allData = await queries.cacheByAddress.fetch(`${chainId}-${account}`) as types.Stake[]
      const hsi = _.find(allData, (hsi): hsi is types.Stake => (
        hsi.custodian.toLowerCase() === stakeData.stakerAddr.toLowerCase()
          && hsi.owner.toLowerCase() === account.toLowerCase()
      ))
      if (!hsi) {
        return { success: false, message: 'owner check' }
      }
    }
    // add more on chain data checks later
    const row = {
      ...request,
      account,
      validStart: new Date(request.validStart * 1_000),
      validUntil: new Date(request.validUntil * 1_000),
    }
    await db(`${args.databaseSchema}.${tableNames.GOOD_ACCOUNT_SIGNATURE}`)
      .insert(row)
      .onConflict(['stakeId'])
      .merge(['validUntil', 'validStart', 'signature', 'account'])
    queries.cacheByAddress.delete(`${chainId}-${account}`)
    return {
      success: true,
    }
  }
}
