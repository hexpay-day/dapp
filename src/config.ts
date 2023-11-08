import yargs from 'yargs'

export const args = yargs().options({
  databaseUrl: {
    type: 'string',
    require: true,
  },
  databaseSchema: {
    type: 'string',
    require: true,
    default: 'public',
  },
  hashSeed: {
    type: 'string',
    require: true,
    default: '590e86e5-4aee-436a-8a1e-714a0d62e577',
  },
  databaseSsl: {
    type: 'boolean',
    require: true,
    default: false,
  },
}).env().parseSync()
