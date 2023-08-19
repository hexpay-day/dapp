<script lang="ts">
	import { ethers } from "ethers";
  import { balance, fetchData } from "../../../stores/hex";
  import { chainId, address, connected } from '../../../stores/web3'
  import {
    Label,
    Input,
    InputAddon,
    Helper,
  } from 'flowbite-svelte'
  import { Icon } from 'flowbite-svelte-icons'
	import _ from "lodash";
	import { DateInput } from 'date-picker-svelte'
	import * as filtersStore from "../../../stores/filters";
	import { derived, writable } from "svelte/store";
  $: fetchData($chainId, $address)
  $: account = address
  const validateAddress = (acc: string) => {
    return ethers.utils.isAddress(acc)
  }
  $: validAccount = derived([account], ([$account]) => {
    return validateAddress($account)
  })
  const startDate = filtersStore.truncatedDay(new Date(+filtersStore.today() + filtersStore.DAY))
  const minDate = new Date(+filtersStore.today() + (filtersStore.DAY * 2))
  // let endDate = minDate
  const amount = writable<string>('')
  let minDateCorrected = new Date(+minDate + filtersStore.timezoneOffset)
  let endDateCorrected = new Date(+minDate + filtersStore.timezoneOffset)
  let endDate = new Date(+endDateCorrected - filtersStore.timezoneOffset)
  const validAmount = (amount: string) => {
    try {
      if (!amount) {
        return null
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
  $: amountIsValid = derived([amount], ([$amount]) => {
    return validAmount($amount)
  })
</script>
<div class="grid grid-cols-2 max-w-4xl m-auto gap-4">
  {#if !$connected}
    connect wallet before proceeding
  {:else}
  <div class="flex flex-col">
    <Label for="owner-input">Owner</Label>
    <Input id="owner-input" class="text-base leading-[1.625rem]" bind:value={$account} color={validAccount ? 'green' : 'red'} />
    <Helper class="text-sm my-2">Gift a new stake to another account, a cold wallet, etc.</Helper>
  </div>
  <div class="flex flex-col">
    <Label for="funder-input">Funder</Label>
    <Input id="funder-input" class="text-base leading-[1.625rem]" bind:value={$address} disabled />
  </div>
  <div class="flex flex-col">
    <Label for="days-input">End Date</Label>
    <div class="flex">
      <InputAddon>
        <Icon name="calendar-week-outline" size="sm" />
      </InputAddon>
      <DateInput
        bind:value={endDateCorrected}
        format="yyyy-MM-dd"
        class="flex flex-grow h-12 ml-[-1px] stake-start-cal-container second-class text-center"
        browseWithoutSelecting
        closeOnSelection
        min={minDateCorrected}
        max={filtersStore.maxDate}
        on:select={() => {
          console.log(endDate.toISOString(), endDateCorrected.toISOString())
          if (+endDate === +endDateCorrected) {
            endDateCorrected = new Date(+endDateCorrected + filtersStore.timezoneOffset)
          }
          endDate = new Date(+endDateCorrected - filtersStore.timezoneOffset)
        }} />
    </div>
    <Helper class="text-sm mt-2 justify-between flex">
      <span class="flex">Start: {filtersStore.dateAsString(startDate)} iso</span>
      <span class="flex">Locked Days: {(+endDate - +new Date(filtersStore.dateAsString(filtersStore.today())) - filtersStore.DAY) / filtersStore.DAY}</span>
    </Helper>
  </div>
  <div class="flex flex-col">
    <Label for="amount-input">Amount</Label>
    <Input
      type="text"
      class="text-center text-base leading-[1.625rem]"
      bind:value={$amount}
      placeholder="0"
      color={$amountIsValid ? 'green' : ($amountIsValid === false ? 'red' : 'base')} />
  </div>
  {/if}
</div>
<style lang="postcss">
  :global(.stake-start-cal-container.second-class input) {
    --date-input-width: 100%;
    border-radius: 0;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    text-align: center;
    padding: 0.375rem;
    /* height: 2.875rem; */
  }
</style>
