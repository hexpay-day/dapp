import { get, writable as w } from "svelte/store"

export const writable = <T>(val: T) => {
  const store = w<T>(val)
  const set = (val: T) => {
    const $store = get(store)
    if ($store === val) return
    store.set(val)
  }
  const update = (fn: (current: T) => T) => {
    const $store = get(store)
    const result = fn($store)
    if (result === $store) return
    store.set(result)
  }
  return {
    set,
    update,
    subscribe: store.subscribe,
  }
}
