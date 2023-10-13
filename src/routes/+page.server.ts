import { redirect } from "@sveltejs/kit"
import { ethers } from 'ethers'
import * as contracts from '../stores/contracts'
import type * as backendClient from '../stores/backend'
import { getByChainId } from '../stores/providers'
import * as queries from '../stores/queries'
import _ from "lodash"

// export const ssr = false;

export const load = async () => {
  throw redirect(307, `/1`)
}
export const actions = {
  'clear-cache': async (a) => {
    const reader = a.request.body?.getReader()
    const data = await reader?.read()
    const request = JSON.parse(data?.value?.toString() as string) as backendClient.ClearCachePayload
    const {
      hash,
      chainId,
      account,
    } = request
    if (!chainId || !hash || !account) return { success: false, message: 'invalid data' }
    const provider = getByChainId(chainId)
    if (!provider) return {
      success: false
    }
    const receipt = await provider.getTransactionReceipt(hash)
    if (!receipt || ethers.getAddress(receipt.from) !== account) return { success: false, message: 'data is not yet available' }
    const all = contracts.all(chainId, null)
    const logs = _(receipt.logs).map((log) => {
      try {
        return all.hsim.interface.parseLog(log as any)
      } catch (err) {}
    }).compact().value()
    const validated = _.find(logs, ({ name }) => (
      name === 'HSITokenize' || 'Transfer'
    ))
    if (!validated) return { success: false, message: 'event not found' }
    queries.cacheByAddress.delete(`${chainId}-${account}`)
    return {
      success: true,
    }
  },
}
