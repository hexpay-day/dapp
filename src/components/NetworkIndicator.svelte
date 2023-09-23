<script lang="ts">
	import {
    Indicator,
    Tooltip,
  } from "flowbite-svelte";
	import { currentBlock, secondsToIso } from "../stores/web3";
</script>

<div class="flex pr-4 items-center">
  {#if $currentBlock?.number}
  <span class="text-xs font-mono text-gray-500">{$currentBlock?.number}</span>
  <Tooltip class="w-48 text-center" placement="top-end">{secondsToIso($currentBlock?.timestamp)}</Tooltip>
  <Indicator
    color="green"
    size="lg"
    border={true}
    placement="center-right" />
  {:else}
  <span class="text-xs font-mono text-gray-500">#####</span>
  <Indicator
    color="orange"
    size="lg"
    border={true}
    placement="center-right" />
  {/if}
</div>
