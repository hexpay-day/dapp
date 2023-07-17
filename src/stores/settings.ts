import type { EncodableSettings } from "@hexpayday/stake-manager/artifacts/types"
import _ from "lodash"
import { get, writable } from "svelte/store"

export const settings = writable<EncodableSettings.SettingsStruct>({
  hedronTipMethod: 0,
  hedronTipMagnitude: 0,
  tipMethod: 0,
  tipMagnitude: 0,
  newStakeMethod: 0,
  newStakeMagnitude: 0,
  newStakeDaysMethod: 0,
  newStakeDaysMagnitude: 0,
  copyIterations: 0,
  consentAbilities: 0,
})
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

export const formSettings = () => ({
  hedronTipMethod: get(hedronTipMethod),
  hedronTipMagnitude: get(hedronTipMagnitude),
  tipMethod: get(tipMethod),
  tipMagnitude: get(tipMagnitude),
  newStakeMethod: get(newStakeMethod),
  newStakeMagnitude: get(newStakeMagnitude),
  newStakeDaysMethod: get(newStakeDaysMethod),
  newStakeDaysMagnitude: get(newStakeDaysMagnitude),
  copyIterations: get(copyIterations),
  consentAbilities: get(consentAbilities),
})
