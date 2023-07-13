import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.EVENT)
  if (!exists) {
    log('creating table %o', utils.tableNames.EVENT)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.EVENT, (t) => {
        t.uuid('eventId').primary()
        t.uuid('contractId')
          .references('contractId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.CONTRACT}`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.text('name').index().notNullable()
        t.text('signature').index().notNullable()
        t.jsonb('args').index().notNullable()
        t.timestamps(true, true)
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.EVENT]))
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.EVENT)
}

