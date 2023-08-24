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
    IconDoorEnter,
    IconFlame,
    IconWallet,
    IconFileCode,
    IconSquareRoundedX,
    IconChevronRight,
    IconClock,
    IconDoorExit,
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
	import { elipsisAddress } from '../../../stores/addresses';
	import { address } from '../../../stores/web3';
</script>

<div class="flex flex-col m-auto relative">
{#if !$ordered.length}
nothing to check out
{:else}
<Timeline order="vertical" class="sequence-timeline ml-3">
  {#each $ordered as group}
  <li class="ml-6 mb-4">
    <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
      <IconChevronRight class="w-3 h-3 text-primary-600 dark:text-primary-400" />
      <IconDoorEnter />
    </span>
    <h3 class="flex items-center mb-1 text-xl font-semibold text-gray-900 dark:text-white">{group.name}</h3>
  </li>
  <Timeline order="vertical" class="sequence-timeline ml-7">
    {#each group.items as item}
      {#if item.type === TaskType.start}
      <TimelineItem title="Start Stake">
        <svelte:fragment slot="icon">
          <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
            <IconFlame class="w-3 h-3 text-primary-600 dark:text-primary-400" />
          </span>
        </svelte:fragment>
        <div class="flex flex-col space-y-2">
          <div class="flex">
            <ButtonGroup divClass="flex flex-row h-[42px]">
              <Button class="flex">
                {#if item.task.fundingOrigin === FundingOrigin.connected}
                <IconWallet />
                {:else}<IconFileCode />
                {/if}
              </Button>
              {#if item.task.fundingOrigin === FundingOrigin.connected}
              <Button class="flex">{elipsisAddress($address, 4)}</Button>
              {/if}
              <Button class="flex">{(item.task.amount ? ethers.utils.formatUnits(item.task.amount, 8) : '0.0')} <HexIcon class="ml-2" size={24} /></Button>
              {#if item.task.fundingOrigin === FundingOrigin.connected}
              <Button class="flex"><IconChevronRight class="w-3 h-3" /></Button>
              <Button class="flex" title="{item.task.contract}"><IconFileCode /></Button>
              {/if}
              <Button class="flex"><IconFlame /></Button>
              <Button class="flex">{elipsisAddress(item.task.for, 4)}</Button>
              <Button class="flex"><IconCircleKey /></Button>
            </ButtonGroup>
          </div>
          <div class="flex flex-row justify-between">
            <ButtonGroup>
              <Button><IconClock /></Button>
              <Button>{dateTimeAsString($useISO ? $startDateISO : $startDateLocal)} {$timezoneLabel}</Button>
              <Button color="alternative"><IconCircleKey class="mr-2" />{item.task.lockedDays} Days</Button>
              <Button>{dateTimeAsString(new Date(+($useISO ? $startDateISO : $startDateLocal) + (DAY * +item.task.lockedDays)))} {$timezoneLabel}</Button>
            </ButtonGroup>
            <Button on:click={() => {
              removeFromSequence(item)
            }}><IconSquareRoundedX /></Button>
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
      <IconDoorExit class="w-3 h-3 text-primary-600 dark:text-primary-400" />
    </span>
    <h3 class="flex items-center mb-1 text-xl font-semibold text-gray-900 dark:text-white">Finish</h3>
  </li>
</Timeline>
{/if}
</div>
