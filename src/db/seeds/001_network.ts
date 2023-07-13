import type { Knex } from "knex"
import * as ids from '../ids'
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
}]

export async function seed(knex: Knex): Promise<void> {
    const fullNetworks = desiredNetworks.map((network) => ({
        ...network,
        networkId: ids.network(network.chainId),
    }))
    await knex(utils.tableNames.NETWORK)
        .withSchema(config.args.databaseSchema)
        .insert(fullNetworks)
        .onConflict(['networkId'])
        .merge()
}
