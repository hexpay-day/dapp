<script lang="ts">
	import {
    Indicator,
    Tooltip,
  } from "flowbite-svelte";
	import { address, currentBlock, secondsToIso } from "../stores/web3";
	import { ethers } from "ethers";
  $: connected = $address !== ethers.constants.AddressZero
</script>

{#if connected}
  <div class="flex pr-4 items-center">
    {#if $currentBlock?.number}
    <span class="text-xs font-mono text-gray-500">
      {$currentBlock?.number}
    </span>
    <Tooltip class="w-48 text-center" placement="top-end">{secondsToIso($currentBlock?.timestamp)}</Tooltip>
    {/if}
    <Indicator
      color="green"
      size="lg"
      border={true}
      placement="center-right" />
  </div>
{/if}
