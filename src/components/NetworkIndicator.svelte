<script lang="ts">
	import {
    Indicator,
    Tooltip,
  } from "flowbite-svelte";
	import { chainId, currentBlock, secondsToIso, chains } from "../stores/web3";
	import A from "./A.svelte";
  // const domainByChainId = new Map<number, string>([
  //   [1, 'etherscan.io'],
  //   [369, 'otter.pulsechain.com']
  // ])
  const backupChain = chains.get(1)
  $: chain = $chainId === 31_337 ? backupChain : chains.get($chainId) || backupChain
  $: link = `${chain?.blockExplorers?.default.url}/block/${$currentBlock?.number}`
</script>

<div class="flex pr-4 items-center">
  {#if $currentBlock?.number}
  <span class="text-xs font-mono text-gray-500"><A bind:link color={false}>{$currentBlock?.number}</A></span>
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
