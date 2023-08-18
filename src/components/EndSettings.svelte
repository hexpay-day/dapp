<script lang="ts">
	import { Icon } from "flowbite-svelte-icons";
  import * as filteredStakesStore from '../stores/filtered-stakes'
	import { Button } from "flowbite-svelte";

  export let stake!: filteredStakesStore.Stake
  $: timeline = filteredStakesStore.timeline
</script>

<div class="flex">
  {#if !filteredStakesStore.isEndable(stake)}
    Stake Not Endable
  {:else}
    {#if $timeline.find(({ stakeId }) => stake.stakeId === stakeId)}
      <Button size="sm" on:click={() => {
        filteredStakesStore.removeFromTimeline(stake.stakeId)
      }}>Edit&NonBreakingSpace;<Icon name="file-edit-solid" /></Button>
    {:else}
      <Button size="sm" on:click={() => {
        filteredStakesStore.addStakeToTimeline(stake)
      }}>Add&NonBreakingSpace;<Icon name="circle-plus-solid" /></Button>
    {/if}
  {/if}
</div>
