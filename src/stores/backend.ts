import type { sequence } from "0xsequence";
import { ethers } from "ethers";

export type StoreSignatureInput = {
  chainId: number;
  stakeId: number;
  validStart: number;
  validUntil: number;
}

export type StoreSignaturePayload = StoreSignatureInput & {
  signature: string;
}

export const storeSignature = async (payload: StoreSignaturePayload) => {
  // send signature to backend
  const res = await fetch('?/good-account', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const result = await res.json()
  console.log('response', result)
}

export const create712Message = {
  requestGoodAccount: ({
    chainId,
    stakeId,
    validStart,
    validUntil,
  }: StoreSignatureInput): sequence.utils.TypedData => ({
    types: {
      Stake: [
        { name: 'stakeId', type: 'uint256', },
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
      validStart,
      validUntil,
    },
  }),
}
