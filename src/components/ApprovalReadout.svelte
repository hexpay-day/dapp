<script lang="ts">
	import { ethers } from 'ethers';
  import {
    Label,
    Toggle,
  } from 'flowbite-svelte'
  let checked = false
  export let amount = 0n
  export let decimals = 18
  export let max = 0n
</script>
<div class="flex flex-row">
  <Label defaultClass="flex flex-row">Default<Toggle class="ml-3" bind:checked={checked} />Max (Balance)</Label>
  <span class="ml-4">{#if checked}{ethers.utils.formatUnits(max, decimals)}{:else}{ethers.utils.formatUnits(amount, decimals)}{/if}</span>
</div>
