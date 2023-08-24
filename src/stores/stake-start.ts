import type { EncodableSettings } from '@hexpayday/stake-manager/artifacts/types/contracts/EncodableSettings'
import type { Tip, MagnitudeSelection, DropdownOption } from "../types";
import dayjs from "dayjs"
import { ethers } from "ethers"
import { derived, get, writable, type Writable } from "svelte/store"
import { address } from "./web3"
import { DAY, startDateISO, minDateISO, timezoneOffset, useISO, updateIfChanged } from "./day"
import _ from 'lodash';

export const account = writable(get(address))
address.subscribe(($address) => {
  account.set($address)
})

const validateAddress = (acc: string) => {
  return ethers.utils.isAddress(acc)
}
export const validAccount = derived([account], ([$account]) => {
  return validateAddress($account)
})
export const amount = writable<string>('')

export const endDateLocal = writable(get(minDateISO))
minDateISO.subscribe(($minDateISO) => {
  endDateLocal.set($minDateISO)
})
export const endDateISO = derived([endDateLocal], ([$endDateLocal]) => {
  return new Date(+$endDateLocal + timezoneOffset($endDateLocal))
})
export const lockedDays = derived([endDateISO, startDateISO], ([$endDateISO, $startDateISO]) => {
  return `${dayjs($endDateISO).diff($startDateISO, 'day')}`
})
export const dateInputValue = writable(get(useISO) ? get(endDateISO) : get(endDateLocal))
useISO.subscribe(($useISO) => {
  updateIfChanged(dateInputValue, $useISO ? get(endDateISO) : get(endDateLocal))
})
endDateISO.subscribe(($endDateISO) => {
  updateIfChanged(dateInputValue, get(useISO) ? $endDateISO : get(endDateLocal))
})
endDateLocal.subscribe(($endDateLocal) => {
  updateIfChanged(dateInputValue, get(useISO) ? get(endDateISO) : $endDateLocal)
})
const validAmount = (amount: string) => {
  try {
    if (!amount) {
      return null
    }
    if (amount[amount.length - 1] === '.') {
      return false
    }
    const parsed = ethers.utils.parseUnits(amount, 8).toBigInt()
    if (parsed === 0n) {
      return null
    }
    return true
  } catch(err) {
    return false
  }
}
export const amountIsValid = derived([amount], ([$amount]) => {
  return validAmount($amount)
})
const defaultSelection: MagnitudeSelection = {
  method: 0n,
  numerator: 0n,
  denominator: 0n,
}
export const newStakeAmountSelection = writable<MagnitudeSelection>({ ...defaultSelection })
export const newStakeDaysSelection = writable<MagnitudeSelection>({ ...defaultSelection, method: 2n })
// newStakeDaysSelection.subscribe(($newStakeDaysSelection) => {
//   console.log($newStakeDaysSelection)
//   debugger;
// })
export const hexTipSelection = writable<MagnitudeSelection>({ ...defaultSelection })
export const hedronTipSelection = writable<MagnitudeSelection>({ ...defaultSelection })
export const showSettings = writable(false)
export const disableRepeatStakeAmountDropdownDuring = derived([
  newStakeDaysSelection,
], ([$newStakeDaysSelection]) => {
  return $newStakeDaysSelection.method >= 1n ? [] : [0,1,4,5,6]
})
export const othersCanEnd = writable(true)
export const canMintHedronAtAnyTime = writable(true)
export const shouldMintHedronAtEnd = writable(true)
export const contractCustodyTokens = writable(true)
export const allowStakeToBeTransferred = writable(false)
export const fundOther = writable(false)
export const copyIterations = writable(255)
export const fundFromWallet = writable(true)
export const startStakeFromUnattributed = writable(false)
export const handleDayUpdate = (e: unknown) => {
  const days = (e as CustomEvent).detail.value as null | bigint
  if (!days) return
  updateEndDateFromDay(days)
}
export const updateEndDateFromDay = (days: bigint) => {
  endDateLocal.set(new Date(+get(minDateISO) + (parseInt(days.toString(), 10) * DAY) - DAY))
}
export const resetEndDay = () => {
  endDateLocal.set(get(minDateISO))
}
export const tips = writable<Tip[]>([])
export const setting = writable<EncodableSettings.SettingsStruct>({
  tipMethod: 0n,
  tipMagnitude: 0n,
  hedronTipMethod: 0n,
  hedronTipMagnitude: 0n,
  newStakeMethod: 0n,
  newStakeMagnitude: 0n,
  newStakeDaysMethod: 0n,
  newStakeDaysMagnitude: 0n,
  copyIterations: 0n,
  consentAbilities: {
    canStakeEnd: false,
    canEarlyStakeEnd: false,
    canMintHedron: false,
    canMintHedronAtEnd: false,
    shouldSendTokensToStaker: false,
    stakeIsTransferrable: false,
    copyExternalTips: false,
    hasExternalTips: false,
  },
})
export const repeatStakeDaysOptions = derived([lockedDays], ($lockedDays) => ([{
  value: 2,
  text: 'Repeat Previous',
  inputText: `${$lockedDays}`,
}, {
  value: 1,
  text: 'Constant',
  placeholder: '1',
  inputText: '',
}, {
  value: 3,
  text: 'Keep Schedule',
  inputText: 'automated',
}, {
  value: 0,
  text: 'Off',
  inputText: 'off',
}] as DropdownOption[]))

export const repeatStakeAmountOptions = derived([newStakeDaysSelection], ([$newStakeDaysSelection]) => (($newStakeDaysSelection.method !== 0n ? [] : [{
  value: 0,
  text: 'Off',
  inputText: 'off',
}]).concat({
  value: 1,
  text: 'Constant',
  inputText: '',
}, {
  value: 4,
  text: '% of Total',
  inputText: '',
}, {
  value: 5,
  text: '% of Principle',
  inputText: '',
}, {
  value: 6,
  text: '% of Yield',
  inputText: '',
})))

export const validatedAccount = derived([account], ([$account]) => {
  return ethers.utils.isAddress($account) ? $account : null
})
