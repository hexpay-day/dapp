import { writable } from "svelte/store";
import axios from 'axios'
import type * as types from '../types'

export const stakes = writable<types.Stake[]>([])

export const maintainable = writable<types.Stake[]>([])

// export const getStakesForDay = async (chainId: number, day: bigint) => {
//   const stakesResponse = await axios.get<types.StakesDayResponse>(`/${chainId}/stakes/${day}`)
//   stakes.update(() => stakesResponse.data.stakes)
// }
