import type { Knex } from 'knex'

import * as configuration from './src/config'
import { makeConfig } from './src/db/config'

const config = makeConfig({
  connection: configuration.args.databaseUrl,
})

const conf = {
  seeds: {
    schemaName: configuration.args.databaseSchema,
    directory: './src/db/seeds',
  },
  migrations: {
    schemaName: configuration.args.databaseSchema,
    directory: './src/db/migrations',
  },
  client: config.client,
  connection: config.connection,
  asyncStackTraces: config.asyncStackTraces,
  acquireConnectionTimeout: config.acquireConnectionTimeout,
  postProcessResponse: config.postProcessResponse,
  wrapIdentifier: config.wrapIdentifier,
} as Knex.Config

const development = conf
const production = conf

export default {
  development,
  production,
}
