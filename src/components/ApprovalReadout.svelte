<script lang="ts">
	import { ethers } from 'ethers';
  import {
    Label,
    Toggle,
  } from 'flowbite-svelte'
	import { numberWithCommas } from '../stores/web3';
  let checked = false
  export let amount = 0n
  export let decimals = 18
  export let max = 0n
</script>
<div class="flex flex-row">
  <Label defaultClass="flex flex-row">Default<Toggle class="ml-3" bind:checked={checked} />Max (Balance)</Label>
  <span class="ml-4">{numberWithCommas(ethers.formatUnits(checked ? max : amount, decimals))}</span>
</div>
