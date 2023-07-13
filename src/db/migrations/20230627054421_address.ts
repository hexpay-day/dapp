import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.ADDRESS)
  if (!exists) {
    log('creating table %o', utils.tableNames.ADDRESS)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.ADDRESS, (t) => {
        t.uuid('addressId').primary()
        t.uuid('networkId')
          .references('networkId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.NETWORK}`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.specificType('hash', 'citext')
          .index()
          .notNullable()
        t.timestamps(true, true)
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.ADDRESS]))
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.ADDRESS)
}

