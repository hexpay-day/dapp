import { writable as w } from "svelte/store"

export const writable = <T>(key: string, baseValue: T) => {
  let localValue = localStorage.getItem(key)
  let defaultValue!: T
  try {
    defaultValue = JSON.parse(localValue as string)
  } catch (err) {
    // defaultValue
    defaultValue = baseValue
  }
  const store = w<T>(defaultValue)
  store.subscribe((value: T) => {
    localStorage.setItem(key, JSON.stringify(value))
  })
  return store
}

// look into syncing cross browser tabs:
// https://dev.to/danawoodman/svelte-quick-tip-connect-a-store-to-local-storage-4idi
