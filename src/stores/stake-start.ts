import type { EncodableSettings } from '@hexpayday/stake-manager/artifacts/types/contracts/EncodableSettings'
import type { Tip, MagnitudeSelection, DropdownOption } from "../types";
import dayjs from "dayjs"
import { ethers } from "ethers"
import { derived, get, writable, type Writable } from "svelte/store"
import { address } from "./web3"
import { DAY, startDateISO, minDateISO, timezoneOffset, useISO } from "./day"
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
// export const dateInputValue = writable(get(useISO) ? get(endDateISO) : get(endDateLocal))
export const dateInputValue = derived([useISO, endDateISO, endDateLocal], ([$useISO, $endDateISO, $endDateLocal]) => {
  return $useISO ? $endDateISO : $endDateLocal
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
export const allowStakeToBeTransfered = writable(false)
export const fundOther = writable(false)
export const copyIterations = writable(255)
export const fundFromWallet = writable(true)
export const startStakeFromUnattributed = writable(false)
export const resetData = () => {
  canMintHedronAtAnyTime.set(true)
  shouldMintHedronAtEnd.set(true)
  contractCustodyTokens.set(true)
  allowStakeToBeTransfered.set(false)
  copyIterations.set(255)
  fundOther.set(false)
  othersCanEnd.set(true)
  fundFromWallet.set(true)
  startStakeFromUnattributed.set(false)
  amount.set('')
  resetEndDay()
  showSettings.set(false)
}
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
  value: 3,
  text: '% of Total',
  inputText: '',
}, {
  value: 4,
  text: '% of Principle',
  inputText: '',
}, {
  value: 5,
  text: '% of Yield',
  inputText: '',
})))

export const validatedAccount = derived([account], ([$account]) => {
  return ethers.utils.isAddress($account) ? $account : null
})
