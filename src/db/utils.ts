import _ from 'lodash'
import type * as pg from 'pg'
import type { Knex } from 'knex'
import * as config from '../config'

export const isConflict = (e: pg.DatabaseError) => e.code === '23505'

// best to not take in data from outside world when doing raw queries
// - always hard code inputs
export const createListConstraint = (
  tableName: string,
  column: string,
  constraints: string[],
): string => {
  const col = _.snakeCase(column)
  const constrained = constraints.map((c) => `'${c}'`).join(',')
  return `
ALTER TABLE ${tableName}
ADD CONSTRAINT check_${col}
CHECK (${col} IN (${constrained}))`
}

export const autoUpdateTimestamp = (tableName: string | string[]) => {
  const tableNameParts = _.isArray(tableName) ? tableName : [tableName]
  return `
CREATE TRIGGER autoupdate_${_.snakeCase(tableNameParts.join('_'))}_timestamp
BEFORE UPDATE ON ${tableNameParts.map((word) => `"${word}"`).join('.')}
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)
EXECUTE PROCEDURE autoupdate_timestamp()`
}

export const resultToCamelCase = <T>(obj: unknown): T | T[] => {
  if (!_.isObject(obj) || _.isDate(obj)) {
    return obj as T
  }
  if (_.isArray(obj)) {
    return obj.map(objectToCamelCase) as T[]
  }
  return objectToCamelCase(obj) as T
}

export const objectToCamelCase = (obj: {
  [key: string]: any;
}) => {
  if (_.isString(obj)) {
    return obj
  }
  return obj && _.reduce(obj, (memo, value, key) => {
    memo[_.camelCase(key)] = resultToCamelCase<string>(value)
    return memo
  }, {} as { [key: string]: any })
}

export const ignoreValues: {
  [key: string]: boolean;
} = {
  '*': true,
}

export const insertIntoTable = async (
  t: Tx,
  table: TableNames,
  rows: any[],
  conflictColumns = ['id'],
  mergeColumns: string[],
) => {
  const chunked = _.chunk(rows, 100)
  for (const r of chunked) {
    await t(table)
      .withSchema(config.args.databaseSchema)
      .insert(r)
      .onConflict(conflictColumns)
      .merge(mergeColumns as unknown as any)
  }
}

export const NETWORK = 'network' as const
export const GOOD_ACCOUNT_SIGNATURE = 'good_account_signature' as const

export const tableNames = {
  NETWORK,
  GOOD_ACCOUNT_SIGNATURE,
} as const

const tn = Object.values(tableNames)

export type TableNames = typeof tn[number]

export enum Tables {
  network,
  goodAccountSignature,
}

export type Tx = Knex | Knex.Transaction
