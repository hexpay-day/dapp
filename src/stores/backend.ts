import type { sequence } from "0xsequence";
import { ethers } from "ethers";

export type StoreSignatureInput = {
  chainId: number;
  stakeId: number;
  custodian: string;
  validStart: number;
  validUntil: number;
}

export type ClearCachePayload = {
  chainId: number;
  account: string;
  hash?: string;
}

export type StoreSignaturePayload = StoreSignatureInput & {
  signature: string;
}

export const clearCache = async (payload: ClearCachePayload) => {
  // send signature to backend
  const res = await fetch('/?/clear-cache', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  await res.json()
}

export const storeSignature = async (payload: StoreSignaturePayload) => {
  // send signature to backend
  const res = await fetch('?/good-account', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  const data = JSON.parse(result.data)
  const keys = data[0]
  return data[keys.success]
}

export const create712Message = {
  requestGoodAccount: ({
    chainId,
    stakeId,
    custodian,
    validStart,
    validUntil,
  }: StoreSignatureInput): sequence.utils.TypedData => ({
    types: {
      Stake: [
        { name: 'stakeId', type: 'uint256', },
        { name: 'custodian', type: 'address', },
        { name: 'validStart', type: 'uint256', },
        { name: 'validUntil', type: 'uint256', },
      ],
    },
    primaryType: 'Stake' as const,
    domain: {
      name: 'HexPay.Day',
      version: '1',
      chainId,
      verifyingContract: ethers.constants.AddressZero,
    },
    message: {
      // the owner of this stake id must be the address
      // that signs this object
      stakeId,
      custodian,
      validStart,
      validUntil,
    },
  }),
}
