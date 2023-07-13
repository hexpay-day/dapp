 import type { Knex } from "knex";
import * as config from '../../config'
import { log } from '../../logger'
import * as utils from '../utils'

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.withSchema(config.args.databaseSchema)
    .hasTable(utils.tableNames.TRANSACTION)
  if (!exists) {
    log('creating table %o', utils.tableNames.TRANSACTION)
    await knex.schema.withSchema(config.args.databaseSchema)
      .createTable(utils.tableNames.TRANSACTION, (t) => {
        t.uuid('transactionId').primary()
        t.uuid('networkId')
          .references('networkId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.NETWORK}`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.uuid('blockId')
          .references('blockId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.BLOCK}`)
          .index()
          .notNullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.text('hash').notNullable().index()
        t.integer('index').notNullable().unsigned().index()
        t.uuid('fromAddressId')
          .references('addressId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.ADDRESS}`)
          .index()
          .nullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.uuid('toAddressId')
          .references('addressId')
          .inTable(`${config.args.databaseSchema}.${utils.tableNames.ADDRESS}`)
          .index()
          .nullable()
          .onDelete('CASCADE')
          .onUpdate('CASCADE')
        t.timestamps(true, true)
        t.index(['networkId', 'hash'], 'transaction_networkid_hash_index')
      })
    await knex.raw(utils.autoUpdateTimestamp([config.args.databaseSchema, utils.tableNames.TRANSACTION]))
  }
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema(config.args.databaseSchema)
    .dropTableIfExists(utils.tableNames.TRANSACTION)
}

