<script lang="ts">
  import * as types from '../types'
	import {
    IconCirclePlus,
    IconFilePencil,
  } from "@tabler/icons-svelte";
  import * as filteredStakesStore from '../stores/filtered-stakes'
  import * as web3Store from '../stores/web3'
	import {
    Button,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";

  export let stake!: types.Stake
  $: timeline = filteredStakesStore.timeline
  $: address = web3Store.address
  const {
    // TimelineTypes,
    addStakeToTimeline,
  } = filteredStakesStore
</script>

<div class="flex">
  {#if !filteredStakesStore.isOptimizable(stake)}
  <Button disabled>Not Optimizable</Button>
  {:else if !filteredStakesStore.isEndable(stake)}
  <Button disabled>Not Endable</Button>
  {:else}
    {#if $timeline.find(({ stake: target }) => stake.stakeId === target.stakeId)}
      <Button size="sm" on:click={() => {
        // removeFromSequence(stake)
      }}>Edit&NonBreakingSpace;<IconFilePencil /></Button> <!-- name="file-edit-solid" -->
    {:else}
    <div class="relative">
      <Button size="sm">Add&NonBreakingSpace;<IconCirclePlus /></Button> <!-- name="circle-plus-solid" -->
      <Dropdown placement="bottom-start">
        <DropdownItem on:click={() => addStakeToTimeline(types.TimelineTypes.UPDATE, stake)}>Update</DropdownItem>
        <DropdownItem on:click={() => addStakeToTimeline(types.TimelineTypes.GOOD_ACCOUNT, stake)}>Good Account</DropdownItem>
        <DropdownItem on:click={() => addStakeToTimeline(types.TimelineTypes.END, stake)}>End Stake</DropdownItem>
        {#if $address === stake.owner}
        <!-- optimized pathway that skips all checks -->
        <DropdownItem on:click={() => addStakeToTimeline(types.TimelineTypes.RESTART_STAKE, stake)}>Restart Stake</DropdownItem>
        {/if}
      </Dropdown>
    </div>
    {/if}
  {/if}
</div>
