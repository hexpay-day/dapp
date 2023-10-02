import type { Knex } from "knex"
import * as utils from '../utils'
import * as config from '../../config'

const desiredNetworks = [{
    chainId: 1,
    name: 'Ethereum',
    testnet: false,
}, {
    chainId: 369,
    name: 'PulseChain',
    testnet: false,
}, {
    chainId: 943,
    name: 'PulseChain Testnet V4',
    testnet: true,
}, {
    chainId: 31337,
    name: 'Hardhat',
    testnet: true,
}]

export async function seed(knex: Knex): Promise<void> {
    await knex(utils.tableNames.NETWORK)
        .withSchema(config.args.databaseSchema)
        .insert(desiredNetworks)
        .onConflict(['chainId'])
        .merge()
}
