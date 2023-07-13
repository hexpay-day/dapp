import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.LOG)
  if (!exists) {
    log('creating table %o', utils.tableNames.LOG)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.LOG, (t) => {
        t.uuid('logId').primary()
        t.uuid('eventId')
          .references('eventId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.EVENT}`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.text('transactionHash').index().notNullable()
        t.bigint('blockNumber').index().notNullable()
        t.integer('index').index().notNullable()
        t.jsonb('args').index().notNullable()
        t.timestamps(true, true)
        t.index(['eventId', 'blockNumber'], 'log_eventid_blocknumber_index')
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.LOG]))
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.LOG)
}

