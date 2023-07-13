import * as ids from '../ids'
import * as utils from '../utils'
import * as conf from '../../../src/config'
import type { Knex } from "knex"
import type { Contract, Progress } from 'knex/types/tables'
import _ from 'lodash'

export const key = 'log-collection'

export async function seed(knex: Knex): Promise<void> {
  const currentContracts = await knex(utils.tableNames.CONTRACT)
    .withSchema(conf.args.databaseSchema)
    .select<Contract[]>('*')
  const currentProgress = await knex(utils.tableNames.PROGRESS)
    .withSchema(conf.args.databaseSchema)
    .select<Progress[]>('*')
  const existingProgressIds = new Set<string>(_.map(currentProgress, 'progressId'))
  for (const contract of currentContracts) {
    const progressId = ids.progress(contract.contractId, key)
    if (existingProgressIds.has(progressId)) {
      continue
    }
    const block = await knex(utils.tableNames.BLOCK)
      .withSchema(conf.args.databaseSchema)
      .join(utils.tableNames.TRANSACTION, `${utils.tableNames.TRANSACTION}.blockId`, `${utils.tableNames.BLOCK}.blockId`)
      .join(utils.tableNames.CONTRACT, `${utils.tableNames.CONTRACT}.transactionId`, `${utils.tableNames.TRANSACTION}.transactionId`)
      .where(`${utils.tableNames.CONTRACT}.contractId`, contract.contractId)
      .first()
    await knex(utils.tableNames.PROGRESS)
      .withSchema(conf.args.databaseSchema)
      .insert([{
        progressId,
        contractId: contract.contractId,
        key,
        value: block.height,
      }])
      .onConflict(['progressId'])
      .merge(['progressId'])
  }
}
