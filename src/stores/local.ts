import _ from "lodash"
import { writable as w } from "svelte/store"

const bigintJSON = {
  stringify: (key: string, value: any) => {
    return typeof value === 'bigint'
      ? { type: 'bigint', value: value.toString() }
      : value
  },
  parse: (key: string, value: any) => {
    if (value && _.isObject(value)) {
      const val = value as Record<string, string>
      if (val.type === 'bigint') return BigInt(val.value)
    }
    return value
  },
}

export const writable = <T>(key: string, baseValue: T) => {
  if (typeof localStorage === 'undefined') return w<T>(baseValue)
  let localValue = localStorage.getItem(key)
  let defaultValue!: T
  try {
    defaultValue = JSON.parse(localValue as string)
    if (defaultValue === null) {
      defaultValue = baseValue
    }
  } catch (err) {
    // defaultValue
    defaultValue = baseValue
  }
  const store = w<T>(defaultValue)
  store.subscribe(($store: T) => {
    localStorage.setItem(key, JSON.stringify($store, bigintJSON.stringify))
  })
  return store
}

// look into syncing cross browser tabs:
// https://dev.to/danawoodman/svelte-quick-tip-connect-a-store-to-local-storage-4idi
