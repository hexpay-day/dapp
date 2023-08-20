<script lang="ts">
	import { ethers } from "ethers";
  import { balance, fetchData } from "../../../stores/hex";
  import { chainId, address, connected } from '../../../stores/web3'
  import {
    Label,
    Input,
    InputAddon,
    Toggle,
    Helper,
    ButtonGroup,
    Button,
  } from 'flowbite-svelte'
  import dayjs from 'dayjs'
  import { Icon } from 'flowbite-svelte-icons'
	import _ from "lodash";
	import { DateInput } from 'date-picker-svelte'
	import * as filtersStore from "../../../stores/filters";
	import { derived, writable } from "svelte/store";
	import DecimalInput from "../../../components/DecimalInput.svelte";
	import MagnitudeSelection from "../../../components/MagnitudeSelection.svelte";
	import * as dayStore from "../../../stores/day";
  const {
    useISO,
    DAY,
    maxDate,
    truncatedDay,
    today,
    timezoneOffset,
    dateTimeAsString,
  } = dayStore
  $: fetchData($chainId, $address)
  $: account = address
  const validateAddress = (acc: string) => {
    return ethers.utils.isAddress(acc)
  }
  $: validAccount = derived([account], ([$account]) => {
    return validateAddress($account)
  })

  const startDateISO = truncatedDay(new Date(+today() + DAY))
  const startDateLocal = new Date(+startDateISO - timezoneOffset(startDateISO))
  const amount = writable<string>('')
  const minDateISO = new Date(+truncatedDay(today()) + (DAY * 2))
  const minDateLocal = new Date(+minDateISO + timezoneOffset(minDateISO))
  let endDateLocal = minDateISO
  $: endDateISO = new Date(+endDateLocal + timezoneOffset(endDateLocal))
  const yesterday = new Date(+new Date(dateTimeAsString(today())) + DAY)
  $: lockedDays = `${dayjs(endDateISO).diff(yesterday, 'day')}` // `${(+endDateISO - +new Date(dateTimeAsString(today())) - DAY) / DAY}`
  $: dateInputValue = $useISO ? endDateISO : endDateLocal
  // let endDateCorrected = new Date(+endDateISO + timezoneOffset)
  // let endDate = new Date(+endDateCorrected - timezoneOffset)
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
  $: amountIsValid = derived([amount], ([$amount]) => {
    return validAmount($amount)
  })
  let othersCanEnd = true
  let canMintHedronAtAnyTime = true
  let shouldMintHedronAtEnd = true
  let contractCustodyTokens = true
  let allowStakeToBeTransferred = false
  let fundOther = false
  const id = _.uniqueId()
  const handleDayUpdate = (e: unknown) => {
    const days = (e as CustomEvent).detail.value as null | bigint
    if (!days) return
    updateEndDateFromDay(days)
  }
  const updateEndDateFromDay = (days: bigint) => {
    endDateLocal = new Date(+minDateISO + (parseInt(days.toString(), 10) * DAY) - DAY)
  }
</script>
<div class="grid grid-cols-2 max-w-5xl m-auto gap-4">
  {#if !$connected}
    connect wallet before proceeding
  {:else}
  <div class="flex flex-col">
    <Label for="funder-input" class="text-gray-900 dark:text-gray-300">{fundOther ? 'Funder' : 'Owner'}</Label>
    <div class="flex flex-row space-x-2">
      <Input id="funder-input" class="text-base leading-[1.375rem]" bind:value={$address} color={validAccount ? 'green' : 'red'} disabled />
    </div>
  </div>
  <div class="flex flex-col" title="Gift a new stake to another account, a cold wallet, etc.">
    <Label for="owner-input">{@html fundOther ? 'Owner' : '&nbsp;'}</Label>
    <Label for="owner-input" defaultClass="flex flex-row">
      <Toggle bind:checked={fundOther} />
      {#if !fundOther}
      <Button size="lg" on:click={() => { fundOther = true } }><Icon name="gift-box-outline" /></Button>
      {:else}
      <Input id="owner-input" class="text-base leading-[1.375rem]" bind:value={$account} />
      {/if}
    </Label>
  </div>
  <div class="flex flex-col flex-grow">
    <div class="flex flex-row space-x-2 flex-grow">
      <div class="flex flex-col">
        <Label for="days-input">Days</Label>
        <ButtonGroup>
          <Button color="primary" disabled={+lockedDays === 5_555} on:click={() => updateEndDateFromDay(5_555n)}>MAX</Button>
          <DecimalInput
            uint
            text={lockedDays}
            on:update={handleDayUpdate}
            inputClass="text-base leading-[1.375rem]"
            validate={(val) => val >= 1n && val <= 5_555n}
            decimals={0} />
        </ButtonGroup>
      </div>
      <div class="flex flex-col flex-grow">
        <Label for="days-input">End Time</Label>
        <Label class="flex flex-row flex-grow font-normal">
          <InputAddon on:click={(e) => {
            console.log(e)
          }}>
            <Icon name="calendar-week-outline" size="sm" />
          </InputAddon>
          <div on:click|preventDefault={(e) => {
            // console.log(e)
          }}>
          <DateInput
            bind:value={dateInputValue}
            format="yyyy-MM-dd HH:mm"
            class="flex flex-grow h-11 ml-[-1px] stake-start-cal-container second-class text-center"
            browseWithoutSelecting
            closeOnSelection
            min={$useISO ? minDateLocal : minDateISO}
            max={maxDate}
            on:select={() => {
              const timezoneOffsetDelta = timezoneOffset(endDateLocal) - timezoneOffset(dateInputValue)
              // console.log(timezoneOffset(endDateLocal))
              // console.log(timezoneOffset(dateInputValue))
              // console.log(timezoneOffsetDelta)
              endDateLocal = $useISO
                ? new Date(+dateInputValue + timezoneOffset(dateInputValue))
                : new Date(+dateInputValue + timezoneOffsetDelta)
              // endDateLocal = truncatedDay(value)
            }} />
            </div>
        </Label>
      </div>
    </div>
    <Helper class="text-sm mt-1 justify-between flex">
      <span class="flex" title={$useISO ? startDateISO.toString() : startDateISO.toISOString()}>Start: {dateTimeAsString($useISO ? startDateISO : startDateLocal)} {$useISO ? 'iso' : 'local'}</span>
      <!-- <span class="flex">Locked Days: {(+endDateISO - +new Date(dateTimeAsString(today())) - DAY) / DAY}</span> -->
    </Helper>
  </div>
  <div class="flex flex-col">
    <Label for="amount-input">Amount</Label>
    <ButtonGroup>
      <Button
        color="primary"
        disabled={$balance === 0n || BigInt($amount) === $balance}
        on:click={() => updateEndDateFromDay($balance)}>MAX</Button>
      <DecimalInput
        inputClass="text-center text-base leading-[1.375rem]"
        placeholder="1234.567" />
      <InputAddon>HEX</InputAddon>
    </ButtonGroup>
    {#if $amountIsValid}
    <Helper class="text-sm mt-1 text-right">{ethers.utils.parseUnits($amount, 8).toBigInt()} Hearts</Helper>
    {/if}
  </div>
  <div class="grid col-span-2 grid-cols-5 gap-4">
    <div class="flex flex-col col-span-2 gap-6">
      <div class="flex flex-col">
        <Toggle bind:checked={othersCanEnd}>Others Can End</Toggle>
      </div>
      <div class="flex flex-col">
        <Toggle bind:checked={canMintHedronAtAnyTime}>Can Mint Hedron at any time</Toggle>
      </div>
      <div class="flex flex-col">
        <Toggle bind:checked={shouldMintHedronAtEnd}>Should Mint Hedron at End</Toggle>
      </div>
      <div class="flex flex-col">
        <Toggle bind:checked={contractCustodyTokens}>Custody Tokens after End</Toggle>
      </div>
      <div class="flex flex-col">
        <Toggle bind:checked={allowStakeToBeTransferred}>Allow Stake to be Transferred</Toggle>
      </div>
      <div class="flex flex-col" title="">
        <Label for="restart-count-{id}">Copy Settings on Restart</Label>
        <DecimalInput
          decimals={0}
          id="restart-count-{id}"
          uint
          defaultText='255'
          infiniteOver={254n}
          placeholder="0" />
      </div>
    </div>
    <div class="flex flex-col col-span-3 gap-2">
      <MagnitudeSelection
        label="$HEX Tip"
        showDenominatorWhenOver={3}
        options={[{
          value: 1,
          text: 'Constant',
        }, {
          value: 4,
          text: '% of Total',
        }, {
          value: 5,
          text: '% of Principle',
        }, {
          value: 6,
          text: '% of Yield',
        }]} />
      <MagnitudeSelection
        label="$HEDRON Tip"
        showDenominatorWhenOver={3}
        options={[{
          value: 1,
          text: 'Constant',
        }, {
          value: 4,
          text: '% of Total',
        }, {
          value: 5,
          text: '% of Principle',
        }, {
          value: 6,
          text: '% of Yield',
        }]} />
      <div class="flex flex-row space-x-4">
        <div class="flex flex-col flex-grow">
          <MagnitudeSelection
            label="New Stake Amount"
            showDenominatorWhenOver={3}
            options={[{
              value: 1,
              text: 'Constant',
            }, {
              value: 4,
              text: '% of Total',
            }, {
              value: 5,
              text: '% of Principle',
            }, {
              value: 6,
              text: '% of Yield',
            }]} />
        </div>
        <div class="flex flex-col flex-grow">
          <MagnitudeSelection
            label="New Stake Days"
            showDenominatorWhenOver={3}
            options={[{
              value: 1,
              text: 'Constant',
            }, {
              value: 2,
              text: 'Repeat Previous',
            }, {
              value: 3,
              text: 'Keep Consistent',
            }]} />
        </div>
      </div>
      <!-- input to select magnitude -->
      <!-- dual input where needed -->
      <!-- graph to show intensity / curve -->
    </div>
  </div>
  <div class="flex flex-col col-span-2">
    <div class="flex justify-end"><Button>Add to Sequence</Button></div>
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
