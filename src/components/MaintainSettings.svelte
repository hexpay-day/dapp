<script lang="ts">
  import * as types from '../types'
  import classnames from 'classnames'
	import {
    IconChevronsRight,
  } from "@tabler/icons-svelte";
  import * as filteredStakesStore from '../stores/filtered-stakes'
  import * as web3Store from '../stores/web3'
	import {
    Button,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";
	import CheckoutButton from './CheckoutButton.svelte';
	import StakeSettings from './StakeSettings.svelte';
	import MaintenanceSetting from './MaintenanceSetting.svelte';
	import { addToSequence } from '../stores/sequence';
	import { TaskType, type TimelineTypes } from '../types';
	import type { EncodableSettings } from '@hexpayday/stake-manager/artifacts/types';

  let settings!: EncodableSettings.SettingsStruct
  export let stake!: types.Stake
  const { TimelineTypes } = types
  $: address = web3Store.address
  console.log(stake)
  const defaultClass = (disabled: boolean) => (
    classnames('font-medium py-2 pl-4 pr-6 text-md hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left flex', {
      'cursor-not-allowed': disabled,
    })
  )
  let timelineType!: types.TimelineTypes
  if (stake.tokenized) {
    timelineType = TimelineTypes.DEPOSIT_HSI
  }
  $: notEndable = !filteredStakesStore.isEndable(stake)
  $: depositingUntokenized = timelineType === TimelineTypes.DEPOSIT_HSI && !stake.tokenized
  const timelineTypesToTask = new Map<TimelineTypes, TaskType>([
    [TimelineTypes.DEPOSIT_HSI, TaskType.depositHsi],
  ])
  const taskTypeFromTimelineType = () => timelineTypesToTask.get(timelineType) as TaskType
</script>

<!-- {#if !filteredStakesStore.isOptimizable(stake)}
<Button disabled>Not Optimizable</Button>
{:else if stake.isHedron}
<Button
  on:click={() => addTaskToTimeline(TimelineTypes.DEPOSIT_HSI, stake)}
  disabled={$timeline && timelineHas(TimelineTypes.DEPOSIT_HSI, stake)}>Deposit</Button>
{:else if !filteredStakesStore.isEndable(stake)}
<Button disabled>Not Endable</Button>
{:else} -->
<div class="flex flex-row justify-between grid-flow-row">
  <div class="flex">
    <Button size="sm"><IconChevronsRight /></Button>
    <Dropdown placement="bottom-start">
      {#if stake.isHedron}
      <DropdownItem
        defaultClass={defaultClass(false)}
        on:click={() => { timelineType = TimelineTypes.DEPOSIT_HSI }}>
        <MaintenanceSetting type={TimelineTypes.DEPOSIT_HSI} />
      </DropdownItem>
      {/if}
      <DropdownItem
        defaultClass={defaultClass(false)}
        on:click={() => { timelineType = TimelineTypes.UPDATE }}>
        <MaintenanceSetting type={TimelineTypes.UPDATE} />
      </DropdownItem>
      <DropdownItem
        defaultClass={defaultClass(notEndable)}
        on:click={() => { timelineType = TimelineTypes.GOOD_ACCOUNT }}
        disabled={notEndable}>
        <MaintenanceSetting type={TimelineTypes.GOOD_ACCOUNT} />
      </DropdownItem>
      <DropdownItem
        defaultClass={defaultClass(notEndable)}
        on:click={() => { timelineType = TimelineTypes.END }}
        disabled={notEndable}>
        <MaintenanceSetting type={TimelineTypes.END} />
      </DropdownItem>
      {#if $address === stake.owner}
      <!-- optimized pathway that skips all checks -->
      <DropdownItem
        defaultClass={defaultClass(notEndable)}
        on:click={() => { timelineType = TimelineTypes.RESTART_STAKE }}
        disabled={notEndable}>
        <MaintenanceSetting type={TimelineTypes.RESTART_STAKE} />
      </DropdownItem>
      {/if}
    </Dropdown>
    <div class="flex px-2 items-center">
      <MaintenanceSetting type={timelineType} />
    </div>
  </div>
  <div class="flex flex-grow">
    {#if depositingUntokenized}
      <Button on:click={() => {}} disabled>Tokenize</Button>
    {/if}
    <StakeSettings bind:value={settings} />
  </div>
  <!-- {/if} -->
  <div class="flex">
    <CheckoutButton disabled={depositingUntokenized} pathReverse={1} action={async () => {
      addToSequence(taskTypeFromTimelineType(), {
        stake,
        settings,
      })
    }} />
  </div>
</div>
