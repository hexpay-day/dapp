import _ from "lodash"
import { writable } from "svelte/store"
import { queryParameters, ssp } from "sveltekit-search-params"

type Defaults = {
  stakeId: number;
  selected: string;
}

const def: Partial<Defaults> = {
  // selected: null,
  // stakeId: null,
}

export const store = writable(def)

export const setDefault = (key: keyof typeof def, value: any) => {
  store.update(($store) => ({
    ...$store,
    [key]: _.isNil($store[key]) ? value : $store[key],
  }))
}
