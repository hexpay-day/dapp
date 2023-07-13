import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.NETWORK)
  if (!exists) {
    log('creating table %o', utils.tableNames.NETWORK)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.NETWORK, (t) => {
        t.uuid('networkId').primary()
        t.integer('chainId').notNullable().unsigned().index()
        t.text('name').notNullable().index()
        t.boolean('testnet').notNullable()
        t.timestamps(true, true)
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.NETWORK]))
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.NETWORK)
}

