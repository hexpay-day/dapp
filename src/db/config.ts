import type { Knex } from 'knex'
// import knex from 'knex'
// import { attachPaginate } from 'knex-paginate'
import _ from 'lodash'

import * as configuration from '../config'

import {
  ignoreValues,
  objectToCamelCase,
} from './utils'

// // setup paginate method
// if (!(knex.QueryBuilder.prototype as any)?.paginate) {
//   attachPaginate()
// }

export const makeConfig = (overrides: Partial<Knex.Config>): Knex.Config => ({
  client: 'pg',
  asyncStackTraces: true,
  acquireConnectionTimeout: 180000,
  pool: {
    min: 0,
    max: 500,
  },
  seeds: {
    extension: 'ts',
    directory: './src/db/seeds',
  },
  migrations: {
    extension: 'ts',
    directory: './src/db/migrations',
  },
  postProcessResponse: (result: any, _queryContext: any) => {
    if (_.isArray(result)) {
      return result.map(objectToCamelCase)
    }
    return objectToCamelCase(result)
  },
  wrapIdentifier: (value: string, origImpl: (value: string) => string, _queryContext: any) => {
    return ignoreValues[value] ? value : origImpl(_.snakeCase(value))
  },
  ...overrides,
})

export const config = makeConfig({
  connection: {
    connectionString: configuration.args.databaseUrl,
    ssl: configuration.args.databaseSsl ? {
      rejectUnauthorized: false,
    } : false,
  },
})
