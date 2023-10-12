import { derived, get, writable } from "svelte/store";
import * as filtersStore from './filters'
import * as addressStore from './addresses'
import _ from "lodash";
import { ethers } from "ethers";
import { today, DAY, launchDate } from './day'
import { renderHedronIcon } from '../stores/image';
import type * as types from '../types'

export const iconExpanded = `<span class="inline-block w-5 text-center ml-auto">&#x25B2;</span>`
export const iconExpand = `<span class="inline-block w-5 text-center ml-auto">&#x25BC;</span>`

export const renderIcon = (v: types.Stake) => {
  return v.isHedron ? renderHedronIcon(v.custodian) : (
    addressStore.perpetuals.has(v.owner) ? `<span class="w-6 inline-block"><img width="20" height="20" alt="a gold letter m on a blue background with faded hexagons and a gold border" src="/maximus.png" title="${v.custodian}" /></span>` : '<span class="w-6 inline-block"></span>'
  )
}

export const all = writable<types.Stake[]>([])

export const timeline = writable<types.StakeAction[]>([])

export const isEndable = (stake: types.Stake) => {
  return stake.owner === addressStore.StakeManager
    || stake.custodian === addressStore.StakeManager
    || addressStore.perpetuals.has(ethers.getAddress(stake.owner))
}
export const isOptimizable = (stake: types.Stake) => {
  return stake.owner === addressStore.StakeManager
    || stake.custodian === addressStore.StakeManager
    || stake.isHedron
    || addressStore.perpetuals.has(ethers.getAddress(stake.owner))
}

export const addStakeToTimeline = (type: types.TimelineTypes, stake: types.Stake) => {
  if (stake.stakeId) {
    // removeFromTimelineById(stake.stakeId)
  }
  timeline.update((list) => (
    list.concat({
      type,
      stake,
    })
  ))
}

export const maxOffsetDays = 30
export const defaultOffsetDays = 2
export const offsetDays = writable<number>(defaultOffsetDays)
export const startDate = writable<Date>(today())
export const untilDate = derived([offsetDays, startDate], ([$offsetDays, $startDate]) => {
  return new Date(+$startDate + (DAY * $offsetDays))
})
export const filtered = derived([
  all,
  filtersStore.optimizable,
  filtersStore.endable,
  startDate,
  untilDate,
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
    const endDay = new Date(+launchDate + (stake.endDay * DAY))
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
