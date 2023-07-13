import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.CONTRACT)
  if (!exists) {
    log('creating table %o', utils.tableNames.CONTRACT)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.CONTRACT, (t) => {
        t.uuid('contractId').primary()
        t.uuid('addressId')
          .references('addressId')
          .inTable(`${config.args.databaseSchema}.address`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.uuid('transactionId')
          .references('transactionId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.TRANSACTION}`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.text('name').notNullable()
        t.timestamps(true, true)
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.CONTRACT]))
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.CONTRACT)
}

