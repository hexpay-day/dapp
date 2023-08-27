<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Timeline,
    TimelineItem,
  } from 'flowbite-svelte'
  import { executeList, ordered, removeFromSequence } from '../../../stores/sequence'
  import { FundingOrigin, TaskType, } from '../../../types'
  import {
    IconCircleKey,
    IconFlame,
    IconWallet,
    IconFileCode,
    IconChevronRight,
    IconClock,
    IconOutbound,
    IconChevronsRight,
    IconX,
    IconFingerprint,
  } from '@tabler/icons-svelte'
  import HexIcon from '../../../components/icons/Hex.svelte'
	import {
    startDateISO,
    startDateLocal,
    useISO,
    timezoneLabel,
    dateTimeAsString,
    DAY,
  } from '../../../stores/day';
	import { ethers } from 'ethers';
  import Address from '../../../components/Address.svelte'
	import { address, numberWithCommas } from '../../../stores/web3';
</script>

<div class="flex flex-col m-auto relative">
{#if !$ordered.length}
nothing to check out
{:else}
<Timeline order="vertical" class="sequence-timeline ml-3">
  {#each $ordered as group}
  <li class="ml-6 mb-4">
    <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
      <!-- <IconChevronRight class="w-4 h-4 text-primary-600 dark:text-primary-400" /> -->
      <IconOutbound class="w-4 h-4 text-primary-600 dark:text-primary-400" />
    </span>
    <h3 class="flex items-center mb-1 text-xl font-semibold text-gray-900 dark:text-white">{group.name}</h3>
  </li>
  <Timeline order="vertical" class="sequence-timeline ml-7">
    {#each group.items as item}
      {#if item.type === TaskType.start}
      <TimelineItem title="Start Stake">
        <svelte:fragment slot="icon">
          <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
            <IconFlame class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </span>
        </svelte:fragment>
        <div class="flex flex-col space-y-2">
          <div class="flex">
            <ButtonGroup divClass="flex flex-row h-[42px]">
              <Button class="flex">
                {#if item.task.fundingOrigin === FundingOrigin.connected}
                <IconWallet class="mr-2" /><Address address={$address} ellipsis size=sm />
                {:else}<IconFileCode /><IconFingerprint class="ml-2" />
                {/if}
              </Button>
              {#if item.task.fundingOrigin === FundingOrigin.connected}
              <Button class="flex">
                <HexIcon class="mr-2" size={24} />
                {numberWithCommas(item.task.amount ? ethers.utils.formatUnits(item.task.amount, 8) : '0.0')}
                <IconChevronRight class="w-4 h-4 mx-2" />
                <IconFileCode />
              </Button>
              {/if}
              <Button class="flex">
                <HexIcon class="mr-2" size={24} />
                {numberWithCommas(item.task.amount ? ethers.utils.formatUnits(item.task.amount, 8) : '0.0')}
                <IconFlame class="ml-2" />
              </Button>
              <Button class="flex">
                <Address address={item.task.for} ellipsis size=sm />
                <IconFingerprint class="ml-2" />
              </Button>
            </ButtonGroup>
          </div>
          <div class="flex flex-row justify-between">
            <ButtonGroup>
              <Button class="py-2"><IconClock /></Button>
              <Button class="py-2">{dateTimeAsString($useISO ? $startDateISO : $startDateLocal)} {$timezoneLabel}</Button>
              <Button class="py-2"><IconCircleKey class="mr-2" />{item.task.lockedDays} Day(s)</Button>
              <Button class="py-2">{dateTimeAsString(new Date(+($useISO ? $startDateISO : $startDateLocal) + (DAY * +item.task.lockedDays)))} {$timezoneLabel}</Button>
            </ButtonGroup>
            <Button class="py-2 px-3" on:click={() => {
              removeFromSequence(item)
            }}><IconX /></Button>
          </div>
        </div>
      </TimelineItem>
      {/if}
    {/each}
  </Timeline>
  <div class="flex justify-end">
    {#if !group.invalid}
    <Button on:click={() => {
      executeList(group)
    }}>Execute Tasks</Button>
    {/if}
  </div>
  {/each}
  <li class="ml-6">
    <div class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900"></div>
    <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
      <IconChevronsRight class="w-4 h-4 text-primary-600 dark:text-primary-400" />
    </span>
    <h3 class="flex items-center mb-1 text-xl font-semibold text-gray-900 dark:text-white">Finish</h3>
  </li>
</Timeline>
{/if}
</div>
