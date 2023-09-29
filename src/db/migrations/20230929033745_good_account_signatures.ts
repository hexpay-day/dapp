import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.GOOD_ACCOUNT_SIGNATURE)
  if (!exists) {
    log('creating table %o', utils.tableNames.GOOD_ACCOUNT_SIGNATURE)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.GOOD_ACCOUNT_SIGNATURE, (t) => {
        t.bigInteger('stakeId').notNullable().unsigned().primary()
        t.text('signature').notNullable().index()
        t.integer('chainId').notNullable().index()
          .references('chainId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.NETWORK}`)
        t.text('account').notNullable().index()
        t.timestamp('validStart').notNullable().index()
        t.timestamp('validUntil').notNullable().index()
        t.timestamps(true, true)
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.GOOD_ACCOUNT_SIGNATURE]))
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.GOOD_ACCOUNT_SIGNATURE)
}
