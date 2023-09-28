import { writable } from "svelte/store";
import type * as types from '../types'
import type { EncodableSettings } from "@hexpayday/stake-manager/artifacts/types";

export const stakes = writable<types.Stake[]>([])

export const maintainable = writable<types.Stake[]>([])

export const fetchMaintainable = async ($chainId: number, $account: string) => {
  if (!$chainId) return
  const res = await fetch(`/${$chainId}/maintain/${$account}`)
  const result = await res.json() as {
    chainId: number;
    maintainable: types.StakesEndingOnDay[];
  }
  console.log(result)
}

export const linear = (selection: types.MagnitudeSelection) => {
  let { method, numerator, denominator } = selection
  // only methods 0-2 are supported currently
  if (method == 0n || method == 2n) {
    // 0 is a rejection of use
    // 2 uses the value provided from chain
    numerator = 0n
    denominator = 0n
  } else if (method == 1n) {
    // 1 is a constant
    denominator = numerator
    numerator = 0n
  }
  method = method % 3n
  const xFactor = method / 3n
  // scaled numbers are not yet available
  return {
    method,
    x: numerator,
    y: denominator,
    b: 0n,
    xFactor,
    yFactor: 0n,
    bFactor: 0n,
  }
}

type InputsToEncodedSettings = {
  targetTip: types.MagnitudeSelection;
  hedronTip: types.MagnitudeSelection;
  newStake: types.MagnitudeSelection;
  newStakeDaysMethod: bigint;
  newStakeDaysMagnitude: bigint;
  copyIterations: number;
  consentAbilities: EncodableSettings.ConsentAbilitiesStruct;
}

export const encodableSettingsFromInputs = ({
  targetTip,
  hedronTip,
  newStake,
  newStakeDaysMethod,
  newStakeDaysMagnitude,
  copyIterations,
  consentAbilities,
}: InputsToEncodedSettings): EncodableSettings.SettingsStruct => ({
  targetTip: linear(targetTip),
  hedronTip: linear(hedronTip),
  newStake: linear(newStake),
  newStakeDaysMethod: newStakeDaysMethod,
  newStakeDaysMagnitude: newStakeDaysMethod === 0n
    ? 0n
    : (
      newStakeDaysMethod === 2n ? 0n
      : (
        newStakeDaysMethod === 1n && newStakeDaysMagnitude === 0n
          ? 1n
          : newStakeDaysMagnitude
      )
    ),
  copyIterations,
  consentAbilities,
})
