import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.BLOCK)
  if (!exists) {
    log('creating table %o', utils.tableNames.BLOCK)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.BLOCK, (t) => {
        t.uuid('blockId').primary()
        t.uuid('networkId')
          .references('networkId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.NETWORK}`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.text('hash')
          .index()
          .notNullable()
        t.bigint('height')
          .notNullable()
          .index()
        t.timestamp('minedTimestamp')
          .index()
          .notNullable()
        t.boolean('finalized')
          .defaultTo(false)
        t.timestamps(true, true)
        t.index(['networkId', 'height'], 'block_networkid_height_index')
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.BLOCK]))
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.BLOCK)
}

