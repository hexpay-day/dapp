<script lang="ts">
	import { ethers } from "ethers";
  import { hexData, fetchData } from "../../../stores/hex";
  import * as addresses from '../../../stores/addresses'
  import { chainId, address, connected, numberWithCommas } from '../../../stores/web3'
  import {
    Label,
    Input,
    InputAddon,
    Toggle,
    Helper,
    ButtonGroup,
    Button,
  } from 'flowbite-svelte'
  import {
    IconCalendar,
    IconGift,
  } from '@tabler/icons-svelte'
  import Tips from '../../../components/settings/Tips.svelte'
	import _ from "lodash";
	import { DateInput } from 'date-picker-svelte'
	import DecimalInput from "../../../components/DecimalInput.svelte";
	import * as dayStore from "../../../stores/day";
	import * as stakeStartStore from "../../../stores/stake-start";
	import * as settingStore from "../../../stores/settings";
  import { encodableSettingsFromInputs } from '../../../stores/stakes'
	import type { EncodableSettings } from "@hexpayday/stake-manager/artifacts/types";
	import { addToSequence } from "../../../stores/sequence";
  import { FundingOrigin, TaskType } from '../../../types'
	import CheckoutButton from "../../../components/CheckoutButton.svelte";
	import ConsentToggles from "../../../components/settings/ConsentToggles.svelte";
	import CopyIterations from "../../../components/settings/CopyIterations.svelte";
  const {
    useISO,
    timezoneLabel,
    maxDateISO,
    maxDays,
    startDateISO,
    startDateLocal,
    minDateISO,
    minDateLocal,
    timezoneOffset,
    dateTimeAsString,
  } = dayStore
  const {
    validAccount,
    account,
    validatedAccount,
  } = stakeStartStore
  const {
    amount,
    fundOther,
    lockedDays,
    dateInputValue,
    endDateLocal,
    amountIsValid,
    showSettings: useAdvancedSettings,
    othersCanEnd,
    canMintHedronAtAnyTime,
    shouldMintHedronAtEnd,
    contractCustodyTokens,
    allowStakeToBeTransfered,
    newStakeDaysSelection,
    newStakeAmountSelection,
    hexTipSelection,
    hedronTipSelection,
    updateEndDateFromDay,
    handleDayUpdate,
    resetData,
    copyIterations,
    fundFromWallet,
    startStakeFromUnattributed,
  } = settingStore
  $: fetchData($chainId, $address)
  $: dateInputBoundValue = $dateInputValue
  const id = _.uniqueId()
  let encodableSettings!: EncodableSettings.SettingsStruct
  $: encodableSettings = encodableSettingsFromInputs({
    targetTip: $hexTipSelection,
    hedronTip: $hedronTipSelection,
    newStake: $newStakeAmountSelection,
    newStakeDaysMethod: $newStakeDaysSelection.method,
    newStakeDaysMagnitude: $newStakeDaysSelection.numerator,
    copyIterations: $copyIterations,
    consentAbilities: {
      canStakeEnd: $othersCanEnd,
      canEarlyStakeEnd: false, // don't allow a stake to be early ended at creation time
      canMintHedron: $canMintHedronAtAnyTime,
      canMintHedronAtEnd: $shouldMintHedronAtEnd,
      shouldSendTokensToStaker: !$contractCustodyTokens,
      stakeIsTransferable: $allowStakeToBeTransfered,
      copyExternalTips: false,
      hasExternalTips: false,
    },
  })
  $: settings = {
    // can flip this to be isolated if desired
    contract: addresses.StakeManager || ethers.constants.AddressZero,
    lockedDays: $lockedDays,
    for: $validatedAccount || ethers.constants.AddressZero,
    amount: $amountIsValid ? $amount : null,
    fundingFromAddress: $fundFromWallet,
    useAdvancedSettings: $useAdvancedSettings,
    fundingOrigin: $fundFromWallet ? FundingOrigin.connected : (
      $startStakeFromUnattributed ? FundingOrigin.unattributed : FundingOrigin.deposited
    ),
    settings: encodableSettings,
  }
</script>
<div class="grid grid-cols-2 max-w-5xl m-auto gap-x-4">
  {#if !$connected}
    connect wallet before proceeding
  {:else}
  <div class="grid gap-4 col-span-2 grid-cols-2">
    <div class="flex flex-col flex-grow col-span-1">
      <div class="flex flex-row space-x-4 flex-grow">
        <div class="flex flex-col flex-shrink">
          <Label
            for="days-input"
            title="{$useISO ? $startDateISO.toString() : $startDateISO.toISOString()}">
            Start: {dateTimeAsString($useISO ? $startDateISO : $startDateLocal)} {$timezoneLabel}
          </Label>
          <ButtonGroup class="flex flex-shrink">
            <Button color="primary" class="px-3" disabled={+$lockedDays === maxDays} on:click={() => updateEndDateFromDay(BigInt(maxDays))}>MAX</Button>
            <DecimalInput
              uint
              text={$lockedDays}
              on:update={handleDayUpdate}
              nullIsZero
              min={1n}
              max={BigInt(maxDays)}
              class="text-base md:w-[80px] flex leading-[1.25rem] text-center"
              decimals={0} />
            <InputAddon>Day(s)</InputAddon>
          </ButtonGroup>
        </div>
        <div class="flex flex-col flex-grow col-span-1">
          <Label for="days-input" class="text-right">End Date/Time</Label>
          <Label class="flex flex-row font-normal stake-start-cal-select">
            <InputAddon class="justify-center flex-none">
              <IconCalendar class="mx-1" />
            </InputAddon>
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <div role="group" class="flex-grow" on:keypress={() => {}} on:click|preventDefault={(e) => {}}>
              <DateInput
                bind:value={dateInputBoundValue}
                format={`yyyy-MM-dd HH:mm ${$timezoneLabel}`}
                class="flex flex-grow h-[2.625rem] ml-[-1px] stake-start-cal-container second-class text-center"
                browseWithoutSelecting
                closeOnSelection
                min={$useISO ? $minDateLocal : $minDateISO}
                max={$maxDateISO}
                on:select={(e) => {
                  const timezoneOffsetDelta = timezoneOffset($endDateLocal) - timezoneOffset(dateInputBoundValue)
                  endDateLocal.set($useISO
                    ? new Date(+dateInputBoundValue + timezoneOffset(dateInputBoundValue))
                    : new Date(+dateInputBoundValue + timezoneOffsetDelta))
                }} />
              </div>
          </Label>
        </div>
      </div>
    </div>
    <div class="flex flex-col col-span-1">
      <div class="flex flex-row">
        <Toggle class="mt-5" bind:checked={$fundFromWallet} />
        <div class="flex flex-col flex-grow">
          <Label for="amount-input">Fund from {$fundFromWallet ? 'Connected Wallet' : 'Contract Balance'}</Label>
          <div class="flex flex-row">
            <ButtonGroup class="flex-grow">
              <Button
                color="primary"
                class="px-3"
                disabled={!$amountIsValid ? $amount === null : ($amount ? BigInt($amount) >= $hexData.balance : false)}
                on:click={() => amount.set(`${$hexData.balance}`)}>MAX</Button>
              <DecimalInput
                max={$hexData.balance}
                decimals={8}
                on:update={(e) => amount.set(`${e.detail.value}`)}
                text={$amountIsValid && $amount ? ethers.utils.formatUnits($amount, 8) : ''}
                class="text-right text-base leading-[1.25rem]"
                placeholder="1234.567" />
              <InputAddon>HEX</InputAddon>
            </ButtonGroup>
          </div>
        </div>
      </div>
      <Helper class="text-sm text-right">{#if $amountIsValid && $amount}{numberWithCommas($amount)} Hearts{:else}&nbsp;{/if}</Helper>
    </div>
  </div>
  <div class="grid col-span-2 grid-cols-2 gap-4">
    <div class="flex flex-col col-span-1">
      <div class="grid grid-cols-2">
        <div class="flex flex-col col-span-1 items-start">
          <Label class="flex flex-row mt-5 leading-[42px]">
            <span class="flex items-center mr-4 flex-shrink">Advanced Settings</span>
            <Toggle bind:checked={$useAdvancedSettings} />
          </Label>
        </div>
        {#if $useAdvancedSettings}
        <div class="flex flex-col col-span-1 mt-5">
          <ConsentToggles />
        </div>
        {/if}
      </div>
    </div>
    {#if $useAdvancedSettings}
    <CopyIterations />
    <div class="flex flex-col col-span-1">
      <Label for="funder-input" class="text-gray-900 dark:text-gray-300">{$fundOther ? 'Funder' : 'Owner'}</Label>
      <div class="flex flex-row space-x-2">
        <Input id="funder-input" class="text-base leading-[1.25rem]" value={$address} disabled />
      </div>
    </div>
    <div class="flex flex-col col-span-1" title="Gift a new stake to another account, a cold wallet, etc.">
      <Label for="owner-input">{@html $fundOther ? 'Owner' : '&nbsp;'}</Label>
      <Label for="owner-input" defaultClass="flex flex-row">
        <Toggle bind:checked={$fundOther} />
        {#if !$fundOther}
        <Button size="md" class="h-[42px]" on:click={() => { fundOther.set(true) } }><IconGift /></Button>
        {:else}
        <Input id="owner-input" class="text-base leading-[1.25rem]" bind:value={$account} color={$validAccount ? 'green' : 'red'} />
        {/if}
      </Label>
    </div>
    <Tips />
    {/if}
    <div class="flex justify-end col-span-{$useAdvancedSettings ? '2' : '1'} items-end flex-row pt-5">
      <CheckoutButton disabled={!$amountIsValid} action={async () => {
        addToSequence(TaskType.start, settings, {
          // we should default to optimizing these calls
          optimize: true,
        })
        resetData()
      }} />
    </div>
  </div>
  {/if}
</div>
