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
    Dropdown,
  } from 'flowbite-svelte'
  import dayjs from 'dayjs'
  import { Icon } from 'flowbite-svelte-icons'
	import _ from "lodash";
	import { DateInput } from 'date-picker-svelte'
	import { derived, writable } from "svelte/store";
	import DecimalInput from "../../../components/DecimalInput.svelte";
	import HexIcon from "../../../components/icons/Hex.svelte";
	import HedronIcon from "../../../components/icons/Hedron.svelte";
	import MagnitudeSelection from "../../../components/MagnitudeSelection.svelte";
	import * as dayStore from "../../../stores/day";
  import type { EncodableSettings } from '@hexpayday/stake-manager/artifacts/types/contracts/EncodableSettings'
  import type { Tip, MagnitudeSelection as MagSelection } from "../../../types";
  import TipAdjuster from "../../../components/TipAdjuster.svelte";
  const {
    useISO,
    DAY,
    timezoneLabel,
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
  $: lockedDays = `${dayjs(endDateISO).diff(yesterday, 'day')}`
  $: dateInputValue = $useISO ? endDateISO : endDateLocal
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
  const defaultSelection: MagSelection = {
    method: 0n,
    numerator: 0n,
    denominator: 0n,
  }
  let newStakeAmountSelection: MagSelection = { ...defaultSelection }
  let newStakeDaysSelection: MagSelection = { ...defaultSelection }
  let hexTipSelection: MagSelection = { ...defaultSelection }
  let hedronTipSelection: MagSelection = { ...defaultSelection }
  $: disableRepeatStakeAmountDropdownDuring = newStakeDaysSelection.numerator > 0n || newStakeDaysSelection.method > 1n ? [] : [1,4,5,6]
  $: console.log(newStakeDaysSelection)
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
  let tips: Tip[] = []
  const setting = writable<EncodableSettings.SettingsStruct>({
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
</script>
<div class="grid grid-cols-2 max-w-5xl m-auto gap-4">
  {#if !$connected}
    connect wallet before proceeding
  {:else}
  <div class="flex flex-col">
    <Label for="funder-input" class="text-gray-900 dark:text-gray-300">{fundOther ? 'Funder' : 'Owner'}</Label>
    <div class="flex flex-row space-x-2">
      <Input id="funder-input" class="text-base leading-[1.25rem]" bind:value={$address} color={validAccount ? 'green' : 'red'} disabled />
    </div>
  </div>
  <div class="flex flex-col" title="Gift a new stake to another account, a cold wallet, etc.">
    <Label for="owner-input">{@html fundOther ? 'Owner' : '&nbsp;'}</Label>
    <Label for="owner-input" defaultClass="flex flex-row">
      <Toggle bind:checked={fundOther} />
      {#if !fundOther}
      <Button size="md" class="h-[42px]" on:click={() => { fundOther = true } }><Icon name="gift-box-outline" /></Button>
      {:else}
      <Input id="owner-input" class="text-base leading-[1.25rem]" bind:value={$account} />
      {/if}
    </Label>
  </div>
  <div class="flex flex-col flex-grow">
    <div class="flex flex-row space-x-4 flex-grow">
      <div class="flex flex-col flex-shrink">
        <Label
          for="days-input"
          title="{$useISO ? startDateISO.toString() : startDateISO.toISOString()}">
          Start: {dateTimeAsString($useISO ? startDateISO : startDateLocal)} {$timezoneLabel}
        </Label>
        <ButtonGroup class="flex flex-shrink">
          <Button color="primary" disabled={+lockedDays === 5_555} on:click={() => updateEndDateFromDay(5_555n)}>MAX</Button>
          <DecimalInput
            uint
            text={lockedDays}
            on:update={handleDayUpdate}
            class="text-base md:w-[80px] flex leading-[1.25rem] text-center"
            validate={(val) => val >= 1n && val <= 5_555n}
            decimals={0} />
          <InputAddon>Day(s)</InputAddon>
        </ButtonGroup>
      </div>
      <div class="flex flex-col flex-grow">
        <Label for="days-input" class="text-right">End Date/Time</Label>
        <Label class="flex flex-row font-normal stake-start-cal-select">
          <InputAddon class="justify-center flex-none">
            <Icon name="calendar-week-outline" class="mx-1" size="sm" />
          </InputAddon>
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <div role="group" class="flex-grow" on:keypress={() => {}} on:click|preventDefault={(e) => {}}>
            <DateInput
              bind:value={dateInputValue}
              format={`yyyy-MM-dd HH:mm ${$timezoneLabel}`}
              class="flex flex-grow h-11 ml-[-1px] stake-start-cal-container second-class text-center"
              browseWithoutSelecting
              closeOnSelection
              min={$useISO ? minDateLocal : minDateISO}
              max={maxDate}
              on:select={() => {
                const timezoneOffsetDelta = timezoneOffset(endDateLocal) - timezoneOffset(dateInputValue)
                endDateLocal = $useISO
                  ? new Date(+dateInputValue + timezoneOffset(dateInputValue))
                  : new Date(+dateInputValue + timezoneOffsetDelta)
              }} />
            </div>
        </Label>
      </div>
    </div>
  </div>
  <div class="flex flex-col">
    <Label for="amount-input">Amount</Label>
    <ButtonGroup>
      <Button
        color="primary"
        disabled={$balance === 0n || BigInt($amount) === $balance}
        on:click={() => updateEndDateFromDay($balance)}>MAX</Button>
      <DecimalInput
        class="text-right text-base leading-[1.25rem]"
        placeholder="1234.567" />
      <InputAddon>HEX</InputAddon>
    </ButtonGroup>
    {#if $amountIsValid}
    <Helper class="text-sm text-right">{ethers.utils.parseUnits($amount, 8).toBigInt()} Hearts</Helper>
    {/if}
  </div>
  <div class="flex flex-col col-span-1">
    <!-- link repeat previous +  -->
    <MagnitudeSelection
      label="Repeat Stake Days"
      on:change={(e) => { newStakeDaysSelection = e.detail.value }}
      showDenominatorNever
      disableInputDuring={[2, 3]}
      maxUint={16}
      options={[{
        value: 1,
        text: 'Constant',
      }, {
        value: 2,
        text: 'Repeat Previous',
      }, {
        value: 3,
        text: 'Keep Schedule',
      }]} />
  </div>
  <div class="flex flex-col col-span-1">
    <MagnitudeSelection
      label="Repeat Stake Amount"
      on:change={(e) => { newStakeAmountSelection = e.detail.value }}
      showDenominatorWhenOver={3}
      maxUint={64}
      disableInputDuring={disableRepeatStakeAmountDropdownDuring}
      disabledDropdownDuring={disableRepeatStakeAmountDropdownDuring}
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
      }]}>
      <span class="flex flex-col items-center min-w-[28px]" slot="before">
        <HexIcon class="mt-2" size={28} />
      </span>
    </MagnitudeSelection>
  </div>
  <div class="grid grid-cols-2 col-span-2 gap-4">
    <div class="flex flex-col col-span-1">
      <Label>&nbsp;</Label>
      <Button>Abilities</Button>
      <Dropdown class="w-80" placement="bottom-start">
        <Label class="p-2">
          <Toggle bind:checked={othersCanEnd}>Others Can End</Toggle>
          <Helper class="pl-14">Anyone can end this stake after the full term is served.</Helper>
        </Label>
        <Label class="p-2">
          <Toggle bind:checked={canMintHedronAtAnyTime}>Can Mint Hedron at any time</Toggle>
          <Helper class="pl-14">Can mint $HEDRON for owner of stake. Custody determined by an option below.</Helper>
        </Label>
        <Label class="p-2">
          <Toggle bind:checked={shouldMintHedronAtEnd}>Should Mint Hedron at End</Toggle>
          <Helper class="pl-14">Mint $HEDRON for owner of stake when stake is being ended.</Helper>
        </Label>
        <Label class="p-2">
          <Toggle bind:checked={contractCustodyTokens}>Custody Tokens after End</Toggle>
          <Helper class="pl-14">Contract should remain custodian of tokens until owner collects them.</Helper>
        </Label>
        <Label class="p-2">
          <Toggle bind:checked={allowStakeToBeTransferred}>Allow Stake to be Transferred</Toggle>
          <Helper class="pl-14">Allow the owner of the stake to change. Can only be turned off after stake start.</Helper>
        </Label>
      </Dropdown>
    </div>
    <div class="flex flex-col col-span-1">
      <Label for="restart-count-{id}">Copy Settings on Restart</Label>
      <DecimalInput
        decimals={0}
        id="restart-count-{id}"
        uint
        defaultText='255'
        infiniteOver={254n}
        placeholder="0" />
    </div>
    <div class="flex flex-col col-span-1">
      <MagnitudeSelection
        label="$HEX Tip"
        on:change={(e) => { hexTipSelection = e.detail.value }}
        showDenominatorWhenOver={3}
        maxUint={64}
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
        }]}>
        <span class="flex flex-col items-center min-w-[28px]" slot="before">
          <HexIcon class="mt-2" size={28} />
        </span>
      </MagnitudeSelection>
    </div>
    <div class="flex flex-col col-span-1">
      <MagnitudeSelection
        label="$HEDRON Tip"
        on:change={(e) => { hedronTipSelection = e.detail.value }}
        showDenominatorWhenOver={3}
        maxUint={64}
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
        }]}>
        <span class="flex flex-col items-center min-w-[28px]" slot="before">
          <HedronIcon size={28} class="mt-2" />
        </span>
      </MagnitudeSelection>
    </div>
    <div class="flex flex-row col-span-2 justify-between">
      <TipAdjuster empty />
    </div>
    {#each tips as tip}
    <div class="flex flex-row col-span-2 justify-between">
      <TipAdjuster {tip} />
    </div>
    {/each}
  </div>
  <div class="flex flex-col col-span-2">
    <div class="flex justify-end"><Button>Add to Sequence<Icon class="ml-2" name="cart-plus-alt-outline" /></Button></div>
  </div>
  {/if}
</div>
<style lang="postcss">
  /* :global(.stake-start-cal-select > div) {
    flex-grow: 1;
  } */
  :global(.stake-start-cal-container.second-class input) {
    --date-input-width: 100%;
    border-radius: 0;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    text-align: center;
    padding: 0.25rem;
  }
</style>
