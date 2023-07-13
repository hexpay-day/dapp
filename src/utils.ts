import _ from 'lodash'

export const timeout = async (ms = 0) => await new Promise((resolve) => setTimeout(resolve, ms))
/**
 * @dev provides a limit on the number of ourstanding promises
 * promises can be added concurrently and will likewise be removed from the list when complete
 * @param limit: number the limit of in flight requests to allow at any given time
 * @param fn the function to run - generally to send out requests
 */
export const fewAtATime = <T extends Array<any>, U>(limit: number, fn: (...a: T) => Promise<U>) => {
  type Bundle = {
    resolved: boolean;
    resolves: (value: unknown) => void;
    args: T;
  }
  const bundles = [] as Bundle[]
  const youKnowTheThing = () => {
    const first = bundles.slice(0, limit)
    for (const bundle of first) {
      if (!bundle.resolved) {
        bundle.resolves(null)
        bundle.resolved = true
      }
    }
    if (!first.length) {
      return
    }
    timeout(10).then(youKnowTheThing).catch(console.error)
  }
  const waitYourTurn = async (args: T) => {
    let resolves!: (value: unknown) => void
    const waiting = new Promise((resolve) => {
      resolves = resolve
    })
    bundles.push({
      args,
      resolves,
      resolved: false,
    })
    youKnowTheThing()
    return waiting
  }
  const removeFromPool = (args: T) => {
    for (let i = 0; i < limit; i += 1) {
      if (bundles[i].args === args) {
        bundles.splice(i, 1)
        break
      }
    }
  }
  return async (...args: T) => waitYourTurn(args)
    .then(async () => {
      try {
        return await fn(...args) as U
      } finally {
        removeFromPool(args)
      }
    })
}

export const printInterval = async <T, U>(
  limiter: number,
  rows: T[],
  l: ((current: number, total: number, list: Set<T>) => void) | string,
  fn: (t: T, index: number) => Promise<U>,
): Promise<U[]> => {
  let idx = 0
  const list: Set<T> = new Set<T>()
  const intervalId = setInterval(() => {
    if (_.isString(l)) {
      console.log(`${l} %o/%o`, idx, rows.length)
    } else {
      l(idx, rows.length, list)
    }
  }, 15_000)
  const results = await Promise.all(rows.map(
    fewAtATime(limiter, async (row, index) => {
      list.add(row)
      const result = await fn(row, index)
      idx += 1
      list.delete(row)
      return result
    }),
  ))
  clearInterval(intervalId)
  return results
}
