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
    IconX,
    IconFingerprint,
  } from '@tabler/icons-svelte'
  import HexIcon from '../../../components/icons/Hex.svelte'
  import TimelineIcon from '../../../components/icons/Timeline.svelte'
  import ApprovalReadout from '../../../components/ApprovalReadout.svelte'
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
  import SequenceGasInfo from '../../../components/SequenceGasInfo.svelte'

  let targeted = 0
</script>

<div class="flex flex-col m-auto relative">
{#if !$ordered.length}
nothing to check out
{:else}
<Timeline order="vertical" class="sequence-timeline ml-3">
  {#each $ordered as group, index}
  <li class="ml-6 mb-4">
    <TimelineIcon type=outbound />
    <h3 class="flex items-center mb-1 text-xl font-semibold text-gray-900 dark:text-white">{group.name}</h3>
  </li>
  <Timeline order="vertical" class="sequence-timeline ml-7">
    {#each group.items as item}
      {#if item.type === TaskType.approval}
      <TimelineItem title="Approval">
        <svelte:fragment slot="icon">
          <TimelineIcon type="thumbup" />
        </svelte:fragment>
        <ApprovalReadout max={item.task.balance} amount={item.task.minimum} decimals={8} />
        <SequenceGasInfo isFirst={index === 0} step={item} />
      </TimelineItem>
      {:else if item.type === TaskType.start}
      <TimelineItem title="Start Stake">
        <svelte:fragment slot="icon">
          <TimelineIcon type="flame" />
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
          <SequenceGasInfo isFirst={index === 0} step={item} />
        </div>
      </TimelineItem>
      {:else if item.type === TaskType.depositHsi}
      <TimelineItem title="Deposit">
        <svelte:fragment slot="icon">
          <TimelineIcon type="deposit" />
        </svelte:fragment>
        <div class="flex flex-col">
          <div class="flex flex-row justify-between">
            <SequenceGasInfo isFirst={index === 0} step={item} />
            <Button class="py-2 px-3" on:click={() => {
              removeFromSequence(item)
            }}><IconX /></Button>
          </div>
        </div>
      </TimelineItem>
      {:else if item.type === TaskType.withdrawHsi}
      <TimelineItem title="Withdraw">
        <svelte:fragment slot="icon">
          <TimelineIcon type="withdraw" />
        </svelte:fragment>
        <div class="flex flex-col">
          <div class="flex flex-row justify-between">
            <!-- <SequenceGasInfo isFirst={index === 0} step={item} /> -->
            id: {numberWithCommas(item.task.stake.stakeId.toString(), '_')}
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
    <Button disabled={index !== targeted} on:click={() => {
      executeList(group)
    }}>Execute Tasks</Button>
    {/if}
  </div>
  {/each}
  <li class="ml-6">
    <div class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900"></div>
    <TimelineIcon type="chevronsright" />
    <h3 class="flex items-center mb-1 text-xl font-semibold text-gray-900 dark:text-white">Finish</h3>
  </li>
</Timeline>
{/if}
</div>
