<script lang="ts">
	import { Icon } from "flowbite-svelte-icons";
  import * as filteredStakesStore from '../stores/filtered-stakes'
  import * as web3Store from '../stores/web3'
	import {
    Button,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";

  export let stake!: filteredStakesStore.Stake
  $: timeline = filteredStakesStore.timeline
  $: address = web3Store.address
  const {
    TimelineTypes,
    addStakeToTimeline,
  } = filteredStakesStore
  /**
   *  on:click={() => {
      filteredStakesStore.addStakeToTimeline(stake)
    }}
   */
</script>

<div class="flex">
  {#if !filteredStakesStore.isOptimizable(stake)}
  <Button disabled>Not Optimizable</Button>
  {:else if !filteredStakesStore.isEndable(stake)}
  <Button disabled>Not Endable</Button>
  {:else}
    {#if $timeline.find(({ stake: target }) => stake.stakeId === target.stakeId)}
      <Button size="sm" on:click={() => {
        filteredStakesStore.removeFromTimeline(stake.stakeId)
      }}>Edit&NonBreakingSpace;<Icon name="file-edit-solid" /></Button>
    {:else}
    <div class="relative">
      <Button size="sm">Add&NonBreakingSpace;<Icon name="circle-plus-solid" /></Button>
      <Dropdown placement="bottom-start">
        <DropdownItem on:click={() => addStakeToTimeline(TimelineTypes.OTHER, stake)}>Other</DropdownItem>
        <DropdownItem on:click={() => addStakeToTimeline(TimelineTypes.GOOD_ACCOUNT, stake)}>Good Account</DropdownItem>
        <DropdownItem on:click={() => addStakeToTimeline(TimelineTypes.END, stake)}>End Stake</DropdownItem>
        {#if $address === stake.owner}
        <!-- optimized pathway that skips all checks -->
        <DropdownItem on:click={() => addStakeToTimeline(TimelineTypes.RESTART, stake)}>Restart Stake</DropdownItem>
        {/if}
      </Dropdown>
    </div>
    {/if}
  {/if}
</div>
