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
    Dropdown,
  } from 'flowbite-svelte'
  import {
    IconCalendar,
    IconGift,
    IconShoppingCart,
    IconShoppingCartBolt,
    IconShoppingCartPlus,
  } from '@tabler/icons-svelte'
	import _ from "lodash";
	import { DateInput } from 'date-picker-svelte'
	import DecimalInput from "../../../components/DecimalInput.svelte";
	import HexIcon from "../../../components/icons/Hex.svelte";
	import HedronIcon from "../../../components/icons/Hedron.svelte";
	import MagnitudeSelection from "../../../components/MagnitudeSelection.svelte";
	import * as dayStore from "../../../stores/day";
	import * as stakeStartStore from "../../../stores/stake-start";
	import type { EncodableSettings } from "@hexpayday/stake-manager/artifacts/types";
	import { addToSequence } from "../../../stores/sequence";
  import { FundingOrigin, TaskType, type MagnitudeSelection as MagSelect } from '../../../types'
	import { goto } from "$app/navigation";
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
    amount,
    fundOther,
    validAccount,
    account,
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
    repeatStakeDaysOptions,
    newStakeAmountSelection,
    hexTipSelection,
    hedronTipSelection,
    disableRepeatStakeAmountDropdownDuring,
    repeatStakeAmountOptions,
    updateEndDateFromDay,
    handleDayUpdate,
    resetData,
    validatedAccount,
    copyIterations,
    fundFromWallet,
    startStakeFromUnattributed,
  } = stakeStartStore
  $: fetchData($chainId, $address)
  $: dateInputBoundValue = $dateInputValue
  const id = _.uniqueId()
  const linear = (selection: MagSelect) => {
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
  let encodableSettings!: EncodableSettings.SettingsStruct
  $: encodableSettings = {
    targetTip: linear($hexTipSelection),
    hedronTip: linear($hedronTipSelection),
    newStake: linear($newStakeAmountSelection),
    newStakeDaysMethod: $newStakeDaysSelection.method,
    newStakeDaysMagnitude: $newStakeDaysSelection.method === 0n
      ? 0n
      : (
        $newStakeDaysSelection.method === 2n ? 0n
        : (
          $newStakeDaysSelection.method === 1n && $newStakeDaysSelection.numerator === 0n
            ? 1n
            : $newStakeDaysSelection.numerator
        )
      ),
    newStakeMethod: $newStakeAmountSelection.method,
    newStakeMagnitude: $newStakeAmountSelection.method === 0n ? 0n : (
      $newStakeAmountSelection.method === 1n
        ? $newStakeAmountSelection.numerator
        : $newStakeAmountSelection.numerator << 32n | $newStakeAmountSelection.denominator
    ),
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
    } as EncodableSettings.ConsentAbilitiesStruct,
  }
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
            <span class="flex items-center mr-4 flex-shrink">Use Advanced</span>
            <Toggle bind:checked={$useAdvancedSettings} />
          </Label>
        </div>
        {#if $useAdvancedSettings}
        <div class="flex flex-col col-span-1">
          <Button class="h-[42px] mt-5">Abilities</Button>
          <Dropdown class="w-80" placement="bottom-start">
            <Label class="p-2">
              <Toggle bind:checked={$othersCanEnd}>Others Can End</Toggle>
              <Helper class="pl-14">Anyone can end this stake after the full term is served.</Helper>
            </Label>
            <Label class="p-2">
              <Toggle bind:checked={$canMintHedronAtAnyTime}>Can Mint Hedron at any time</Toggle>
              <Helper class="pl-14">Can mint $HEDRON for owner of stake. Custody determined by option below.</Helper>
            </Label>
            <Label class="p-2">
              <Toggle bind:checked={$shouldMintHedronAtEnd}>Should Mint Hedron at End</Toggle>
              <Helper class="pl-14">Mint $HDRN for owner of stake when stake is being ended.</Helper>
            </Label>
            <Label class="p-2">
              <Toggle bind:checked={$contractCustodyTokens}>Custody Tokens</Toggle>
              <Helper class="pl-14">Contract should retain custodian of tokens until owner collects them.</Helper>
            </Label>
            <Label class="p-2">
              <Toggle bind:checked={$allowStakeToBeTransfered}>Allow Stake to be Transferred</Toggle>
              <Helper class="pl-14">Allow the owner of the stake to change. Can only be turned off after stake start.</Helper>
            </Label>
            {#if !$fundFromWallet}
            <Label class="p-2">
              <Toggle bind:checked={$startStakeFromUnattributed}>Start Stake from Unattributed</Toggle>
              <Helper class="pl-14">Use unattributed tokens already deposited in contract to start stake.</Helper>
            </Label>
            {/if}
          </Dropdown>
        </div>
        {/if}
      </div>
    </div>
    {#if $useAdvancedSettings}
    <div class="flex flex-col col-span-1">
      <Label for="restart-count-{id}">Copy Settings on Restart</Label>
      <DecimalInput
        decimals={0}
        id="restart-count-{id}"
        uint
        defaultText={`${$copyIterations}`}
        on:update={(e) => { copyIterations.set(e.detail.value) }}
        infiniteAt={255n}
        placeholder="0" />
    </div>
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
    <div class="flex flex-col col-span-1">
      <div class="flex flex-row">
        <div class="flex flex-col flex-grow">
          <MagnitudeSelection
            label="Repeat Stake Days"
            on:change={(e) => { newStakeDaysSelection.set(e.detail.value) }}
            showDenominatorNever
            nullIsZero
            disableInputDuring={[0, 2, 3]}
            maxUint={16}
            options={$repeatStakeDaysOptions}
            suffix="Day(s)" />
        </div>
      </div>
    </div>
    <div class="flex flex-col col-span-1">
      <MagnitudeSelection
        label="Repeat Stake Amount"
        on:change={(e) => { newStakeAmountSelection.set(e.detail.value) }}
        showDenominatorWhenOver={3}
        maxUint={64}
        suffix="HEX"
        disabledDropdownDuring={$disableRepeatStakeAmountDropdownDuring}
        disableInputDuring={$disableRepeatStakeAmountDropdownDuring}
        options={$repeatStakeAmountOptions}>
        <span class="flex flex-col items-center min-w-[28px]" slot="before">
          <HexIcon class="mt-2" size={28} />
        </span>
      </MagnitudeSelection>
    </div>
    <div class="grid grid-cols-2 col-span-2 gap-4">
      <div class="flex flex-col col-span-1">
        <MagnitudeSelection
          label="Tip"
          on:change={(e) => { hexTipSelection.set(e.detail.value) }}
          showDenominatorWhenOver={2}
          maxUint={64}
          suffix="HEX"
          disableInputDuring={[0]}
          options={[{
            value: 0,
            text: 'Off',
            inputText: 'off',
          }, {
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
          }]}>
          <span class="flex flex-col items-center min-w-[28px]" slot="before">
            <HexIcon class="mt-2" size={28} />
          </span>
        </MagnitudeSelection>
      </div>
      <div class="flex flex-col col-span-1">
        <MagnitudeSelection
          label="Tip"
          on:change={(e) => { hedronTipSelection.set(e.detail.value) }}
          showDenominatorWhenOver={3}
          maxUint={64}
          suffix="HDRN"
          disableInputDuring={[0]}
          options={[{
            value: 0,
            text: 'Off',
            inputText: 'off',
          }, {
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
          }]}>
          <span class="flex flex-col items-center min-w-[28px]" slot="before">
            <HedronIcon size={28} class="mt-2" />
          </span>
        </MagnitudeSelection>
      </div>
    </div>
    {/if}
    <div class="flex justify-end col-span-{$useAdvancedSettings ? '2' : '1'} items-end flex-row">
      <ButtonGroup>
        <Button disabled={!$amountIsValid} class="h-[42px] mt-5" on:click={() => {
          addToSequence(TaskType.start, settings, true)
          resetData()
        }}>Add to Sequence</Button>
        <Button disabled={!$amountIsValid} class="mt-5" on:click={() => {
          addToSequence(TaskType.start, settings, true)
          resetData()
          goto('./checkout')
        }}><IconShoppingCartBolt /></Button>
      </ButtonGroup>
    </div>
  </div>
  {/if}
</div>
