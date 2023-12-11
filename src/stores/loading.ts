import { get, writable } from "svelte/store"

export const loading = (() => {
  const l = writable(0)
  return {
    ...l,
    increment: () => {
      const val = get(l) + 1
      l.set(val)
      return val
    },
    decrement: () => {
      const val = Math.max(0, get(l) - 1)
      l.set(val)
      return val
    },
  }
})()