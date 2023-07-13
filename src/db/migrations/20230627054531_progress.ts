import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.PROGRESS)
  if (!exists) {
    log('creating table %o', utils.tableNames.PROGRESS)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.PROGRESS, (t) => {
        t.uuid('progressId').primary()
        t.uuid('contractId')
          .references('contractId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.CONTRACT}`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.text('key').index().notNullable()
        t.bigint('value').index().notNullable()
        t.timestamps(true, true)
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.PROGRESS]))
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.PROGRESS)
}
