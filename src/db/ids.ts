import * as ethers from 'ethers'
import * as uuid from 'uuid'
import _ from 'lodash'

import * as config from '../../src/config'

export const hash = (list: (string | number | boolean)[], seed = config.args.hashSeed) => (
  uuid.v5(list.join('#'), seed)
)

export const network = (chainId: number) => hash([
  chainId,
])

export const block = (networkId: string, blockHash: string) => hash([
  networkId,
  blockHash,
])

export const contract = (addressId: string, transactionId: string) => hash([
  addressId,
  transactionId,
])

export const event = (contractId: string, name: string, signature: string, args: string[]) => hash([
  contractId,
  name,
  JSON.stringify(args),
])
export const log = (eventId: string, blockHeight: number, transactionHash: string, logIndex: number) => hash([
  eventId,
  blockHeight,
  transactionHash,
  logIndex,
])

export const address = (networkId: string, addressHash: string) => hash([
  networkId,
  ethers.utils.getAddress(addressHash),
])

export const transaction = (networkId: string, transactionHash: string) => hash([
  networkId,
  transactionHash,
])

export const progress = (contractId: string, key: string) => hash([
  contractId,
  key,
])

export const stake = (contractId: string, stakeIdParam: bigint) => hash([
  contractId,
  stakeIdParam.toString(),
])
