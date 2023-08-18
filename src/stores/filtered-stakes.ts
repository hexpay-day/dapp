import { derived, get, writable } from "svelte/store";
import * as filtersStore from './filters'
import * as addressStore from './addresses'
import _ from "lodash";
import { ethers } from "ethers";

export type Stake = {
  owner: string;
  custodian: string;
  lockedDay: number;
  stakedDays: number;
  endDay: number;
  isHedron: boolean;
  stakeId: number;
}

export const all = writable<Stake[]>([])

export const timeline = writable<Stake[]>([])

export const isEndable = (stake: Stake) => {
  return stake.owner === addressStore.StakeManager
    || stake.custodian === addressStore.StakeManager
    || addressStore.perpetuals.has(ethers.utils.getAddress(stake.owner))
}
export const isOptimizable = (stake: Stake) => {
  return stake.owner === addressStore.StakeManager
    || stake.custodian === addressStore.StakeManager
    || stake.isHedron
    || addressStore.perpetuals.has(ethers.utils.getAddress(stake.owner))
}

export const removeFromTimeline = (stakeId: number) => {
  timeline.update((list) => (
    list.filter((item) => item.stakeId !== stakeId)
  ))
}

export const addStakeToTimeline = (stake: Stake) => {
  removeFromTimeline(stake.stakeId)
  timeline.update((list) => (
    list.concat(stake)
  ))
}

export const filtered = derived([
  all,
  filtersStore.optimizable,
  filtersStore.endable,
  filtersStore.startDate,
  filtersStore.untilDate,
  filtersStore.owners,
  filtersStore.stakeIds,
], ([$stakes, $optimizable, $endable, $startDate, $untilDate, $owners, $stakeIds]) => {
  // console.log($stakes.length, $endable, $startDate.toISOString(), $untilDate.toISOString(), $owners.length, $stakeIds.length)
  return $stakes.filter((stake) => {
    if ($optimizable) {
      const optimizablePathway = isOptimizable(stake)
      if (!optimizablePathway) {
        return false
      }
    }
    if ($endable) {
      const endablePathway = isEndable(stake)
      if (!endablePathway) {
        return false
      }
    }
    // start and until date always exists
    const endDay = new Date(+filtersStore.launchDate + (stake.endDay * filtersStore.DAY))
    if ($startDate > endDay || $untilDate < endDay) {
      return false
    }
    let defaultResult = true
    if ($owners.length) {
      // owners must be checksummed addresses
      const ownerHashes = _.map($owners, (address) => address.hash.toLowerCase())
      const stakeConnected = ownerHashes.includes(stake.owner.toLowerCase()) || ownerHashes.includes(stake.custodian.toLowerCase())
      defaultResult = false
      if (stakeConnected) {
        return true
      }
    }
    if ($stakeIds.length) {
      const stakeIdConnected = $stakeIds.includes(stake.stakeId)
      defaultResult = false
      if (stakeIdConnected) {
        return true
      }
    }
    return defaultResult
  })
})
