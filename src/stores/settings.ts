import type { EncodableSettings } from "@hexpayday/stake-manager/artifacts/types"
import _ from "lodash"
import { get, writable } from "svelte/store"

export const emptySettings = () => ({
  targetTip: {
    method: 0n,
    xFactor: 0n,
    x: 0n,
    yFactor: 0n,
    y: 0n,
    bFactor: 0n,
    b: 0n,
  },
  hedronTip: {
    method: 0n,
    xFactor: 0n,
    x: 0n,
    yFactor: 0n,
    y: 0n,
    bFactor: 0n,
    b: 0n,
  },
  newStake: {
    method: 0n,
    xFactor: 0n,
    x: 0n,
    yFactor: 0n,
    y: 0n,
    bFactor: 0n,
    b: 0n,
  },
  newStakeDaysMethod: 0n,
  newStakeDaysMagnitude: 0n,
  copyIterations: 0n,
  consentAbilities: {
    canStakeEnd: false,
    canEarlyStakeEnd: false,
    canMintHedron: false,
    canMintHedronAtEnd: false,
    shouldSendTokensToStaker: false,
    stakeIsTransferable: false,
    copyExternalTips: false,
    hasExternalTips: false,
  },
})

export const settings = writable<EncodableSettings.SettingsStruct>(emptySettings())
export const hedronTipMethod = writable(0)
export const hedronTipMagnitude = writable(0)
export const tipMethod = writable(0)
export const tipMagnitude = writable(0)
export const newStakeMethod = writable(0)
export const newStakeMagnitude = writable(0)
export const newStakeDaysMethod = writable(0)
export const newStakeDaysMagnitude = writable(0)
export const copyIterations = writable(0)
export const consentAbilities = writable(0)

export const updateConsentAbilities = (index: number, flag: boolean) => {
  const currentConsentAbilities = get(consentAbilities)
  const binaryAbilities = _.padStart(currentConsentAbilities.toString(2), 8, '0')
  const prefix = binaryAbilities.slice(0, index)
  const suffix = binaryAbilities.slice(index + 1)
  const binaryValue = flag ? 1 : 0
  const newBinary = `${prefix}${binaryValue}${suffix}`
  const nextValue = parseInt(newBinary, 2)
  consentAbilities.update(() => nextValue)
}

// export const formSettings = () => ({
//   hedronTipMethod: get(hedronTipMethod),
//   hedronTipMagnitude: get(hedronTipMagnitude),
//   tipMethod: get(tipMethod),
//   tipMagnitude: get(tipMagnitude),
//   newStakeMethod: get(newStakeMethod),
//   newStakeMagnitude: get(newStakeMagnitude),
//   newStakeDaysMethod: get(newStakeDaysMethod),
//   newStakeDaysMagnitude: get(newStakeDaysMagnitude),
//   copyIterations: get(copyIterations),
//   consentAbilities: get(consentAbilities),
// })
