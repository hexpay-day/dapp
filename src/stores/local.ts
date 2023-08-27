import _ from "lodash"
import { derived, get, writable as w, type Writable } from "svelte/store"
import { address, chainId } from "./web3"
import type { Step } from '../types'
import { ethers } from "ethers"

const bigintJSON = {
  stringify: (key: string, value: any) => {
    return typeof value === 'bigint'
      ? `${value.toString()}n`
      : value
  },
  parse: (key: string, value: any) => {
    if (value && _.isString(value)) {
      if (value.slice(-1) !== 'n') {
        return value
      }
      const matches = value.match(/\d+n/igmu)
      if (!matches || matches.length !== 1) {
        return value
      }
      return BigInt(value.slice(0, value.length - 1))
    }
    return value
  },
}

export const writable = <T>(key: string, baseValue: T) => {
  if (typeof localStorage === 'undefined') return w<T>(baseValue)
  let localValue = localStorage.getItem(key)
  let defaultValue!: T
  try {
    defaultValue = JSON.parse(localValue as string, bigintJSON.parse)
    if (defaultValue === null) {
      defaultValue = baseValue
    }
  } catch (err) {
    defaultValue = baseValue
  }
  const store = w<T>(defaultValue)
  store.subscribe(($store: T) => {
    localStorage.setItem(key, JSON.stringify($store, bigintJSON.stringify))
  })
  return store
}

const key = derived([chainId, address], ([$chainId, $address]) => {
  if ($chainId === 0 || $address === ethers.constants.AddressZero) return 'local'
  return `${$chainId}/${$address}`
})

const defaultState = (key: string): Writable<{
  sequence: Step[];
}> => writable(key, {
  sequence: [],
})
const memoryCache = new Map<string, ReturnType<typeof defaultState>>()

export const scoped = derived([key], ([$key]) => {
  const cached = memoryCache.get($key) || writable($key, get(defaultState($key)))
  memoryCache.set($key, cached)
  return cached
})

export const setScoped = (scope: typeof scoped, path: any, value: any) => {
  const $scoped = get(scoped)
  const current = _.get($scoped, path)
  if (_.isEqual(current, value)) return
  // might cause a few extra re-renders but easier than importing way more packages
  $scoped.set(_.set(get($scoped), path, value))
}

// look into syncing cross browser tabs:
// https://dev.to/danawoodman/svelte-quick-tip-connect-a-store-to-local-storage-4idi
