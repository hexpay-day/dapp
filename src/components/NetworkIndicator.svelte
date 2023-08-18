<script lang="ts">
	import { Indicator } from "flowbite-svelte";
	import { address, currentBlock, secondsToIso } from "../stores/web3";
	import { ethers } from "ethers";
  $: connected = $address !== ethers.constants.AddressZero
</script>

{#if connected}
  <div class="flex pr-4 items-center">
    {#if $currentBlock?.number}
    <span class="text-xs font-mono text-gray-500" title={secondsToIso($currentBlock?.timestamp)}>
      {$currentBlock?.number}
    </span>
    {/if}
    <span>
      <Indicator
        color="green"
        size="lg"
        border={true}
        placement="center-right" />
    </span>
  </div>
{/if}