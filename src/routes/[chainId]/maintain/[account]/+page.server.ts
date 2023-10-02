import _ from 'lodash'
import type { Actions } from "@sveltejs/kit";
import * as backendClient from '../../../../stores/backend'
import * as contracts from '../../../../stores/contracts'
import * as addresses from '../../../../stores/addresses'

import type * as types from '../../../../types'
import * as queries from '../../../../stores/queries'
import { sequence } from '0xsequence';
import { getByChainId } from '../../../../stores/providers';
import { db } from '../../../../db';
import { tableNames } from '../../../../db/utils';
import { ethers } from 'ethers';
import { args } from '../../../../config';
import * as rpcQueries from '../../../../stores/rpc-queries'

export const load = async ({ params }: { params: { chainId: string; account: string; } }) => {
  const chainId = +params.chainId
  // this will cause perpetuals to not show up in the list
  // because for a week, they will not have active stakes
  const [perpetuals, maintainable] = await Promise.all([
    queries.cacheByAddress.fetch(`${chainId}-perpetuals`).catch(() => [] as types.Stake[]),
    queries.cacheByAddress.fetch(`${chainId}-${ethers.utils.getAddress(params.account)}`).catch(() => [] as types.Stake[]),
  ])
  return {
    chainId,
    maintainable,
    perpetuals,
  }
}

export const actions: Actions = {
  'good-account': async (a) => {
    const reader = a.request.body?.getReader()
    const data = await reader?.read()
    const request = JSON.parse(data?.value?.toString() as string) as backendClient.StoreSignaturePayload
    const chainId = +(a.params.chainId as string)
    const account = ethers.utils.getAddress(a.params.account as string)
    const typedRequest = backendClient.create712Message.requestGoodAccount({
      chainId,
      stakeId: request.stakeId,
      custodian: request.custodian,
      validStart: request.validStart,
      validUntil: request.validUntil,
    })
    const provider = getByChainId(chainId)
    const result = await sequence.utils.isValidTypedDataSignature(account, typedRequest, request.signature, provider)
    if (!result) {
      return { success: false, message: 'invalid signature' }
    }
    // check that address owns stake
    const stakes = await rpcQueries.loadStakeLists(chainId, request.custodian)
    const stake = _.find(stakes, ({ stakeId }) => stakeId === request.stakeId)
    if (!stake || stake.stakeId !== request.stakeId) {
      return { success: false, message: 'stake does not exist', data: stake }
    }
    if (ethers.utils.getAddress(request.custodian) !== account) {
      // check that the account owns the stake
      const [hsiInfoOwner, hsiInfoExisting] = await Promise.all([
        rpcQueries.loadHsiFrom(chainId, account),
        rpcQueries.loadHsiFrom(chainId, addresses.ExistingStakeManager),
      ])
      const search = [request.custodian, ethers.utils.getAddress(request.custodian)]
      if (_.intersection(hsiInfoOwner.all, search).length) {
        // hsi owned by owner
      } else if (_.intersection(hsiInfoExisting.all, search).length) {
        // hsi is in the existing contract - check ownership
        const all = contracts.all(chainId, null)
        const owner = await all.existingStakeManager.stakeIdToOwner(request.custodian)
        if (owner !== account) {
          return { success: false, message: 'stake not owned' }
        }
      } else {
        return { success: false, message: 'stake not owned' }
      }
    }
    // add more on chain data checks later
    const row = {
      ..._.omit(request, ['custodian']),
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
