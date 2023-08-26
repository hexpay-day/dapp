import type { Readable } from "svelte/store";
import { readable as importR } from "svelte/store";

export const readable = <T>(def: T, r: Readable<Promise<T>>, ctch?: (err: any) => void) => {
  return importR(def, (set) => {
    let last!: Promise<T>
    let $last!: T
    return r.subscribe(async (val) => {
      last = val
      try {
        const $val = await val
        if (val === last && $val !== $last) {
          $last = $val
          set($last)
        }
      } catch (err) {
        ctch?.(err)
      }
    })
  })
}
