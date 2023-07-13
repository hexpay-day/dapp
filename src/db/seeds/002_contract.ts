import * as ids from '../ids'
import * as utils from '../utils'
import * as config from '../../config'
import type { Network } from "knex/types/tables"
import type { Knex } from "knex"
import { provider } from '../../stores/providers'
import * as addresses from '../../stores/addresses'

const contracts = [{
  name: 'Hex',
  transactionHash: '0xcbe7bc037f24b04d8428e45416f0bc906105bad3ac63ce2df72702497c081668',
  hash: addresses.Hex,
}, {
  name: 'HSIM',
  transactionHash: '0xf239da441854b87c4c6685263730ba05042f3e0e480cd391ec24318f2e0069c9',
  hash: addresses.HSIM,
}]

export async function seed(knex: Knex): Promise<void> {
  const networks = await knex(utils.tableNames.NETWORK)
    .withSchema(config.args.databaseSchema)
    .select<Network[]>('*')
  for (const contract of contracts) {
    const receipt = await provider.getTransactionReceipt(contract.transactionHash)
    const block = await provider.getBlock(receipt.blockHash)
    await knex.transaction(async (tx) => {
      await Promise.all(networks.map(async (network) => {
        const networkId = network.networkId
        const blockId = ids.block(networkId, block.hash)
        const transactionId = ids.transaction(networkId, receipt.transactionHash)
        const fromAddressId = ids.address(networkId, receipt.from)
        const contractAddressId = ids.address(networkId, contract.hash)
        await tx(utils.tableNames.BLOCK)
          .withSchema(config.args.databaseSchema)
          .insert([{
            blockId,
            networkId,
            hash: block.hash,
            height: BigInt(block.number),
            minedTimestamp: new Date(block.timestamp * 1_000),
            finalized: true, // this should usually be the case
          }])
          .onConflict(['blockId'])
          .merge()
        await tx(utils.tableNames.ADDRESS)
          .withSchema(config.args.databaseSchema)
          .insert([{
            addressId: fromAddressId,
            networkId,
            hash: receipt.from,
          }, {
            addressId: contractAddressId,
            networkId,
            hash: contract.hash,
          }])
          .onConflict(['addressId'])
          .merge()
        await tx(utils.tableNames.TRANSACTION)
          .withSchema(config.args.databaseSchema)
          .insert([{
            transactionId,
            networkId,
            blockId,
            hash: receipt.transactionHash,
            index: receipt.transactionIndex,
            fromAddressId,
            toAddressId: contractAddressId,
          }])
          .onConflict(['transactionId'])
          .merge()
        await tx(utils.tableNames.CONTRACT)
          .withSchema(config.args.databaseSchema)
          .insert([{
            contractId: ids.contract(contractAddressId, receipt.transactionHash),
            addressId: contractAddressId,
            transactionId,
            name: contract.name,
          }])
          .onConflict(['contractId'])
          .merge()
      }))
    })
  }
}
