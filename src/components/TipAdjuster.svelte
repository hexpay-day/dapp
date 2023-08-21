<script lang="ts">
  import {
	Button,
    ButtonGroup, Spinner, Toggle,
  } from 'flowbite-svelte'
  import DecimalInput from './DecimalInput.svelte';
	import type { Tip } from '../types';
	import { currencyMetadata } from '../stores/tip';
	import { ethers } from 'ethers';
	import { Icon } from 'flowbite-svelte-icons';
  const defaultTip = {
    currency: ethers.constants.AddressZero,
    limit: 0n,
    numerator: 0n,
    denominator: 0n,
  }
	const defaultMetadata = {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  }
  export let empty = false
  export let tip: Tip = defaultTip;
  let updatedTip = { ...tip }
  let checked = false
</script>
{#await empty ? Promise.resolve(defaultMetadata) : currencyMetadata(tip?.currency)}
  <Spinner />
{:then metadata}
<div class="flex flex-grow">
  <ButtonGroup divClass="flex flex-grow">
    <Button><Icon name="caret-down-outline" size="sm" /></Button>
    <DecimalInput
      on:update={(e) => { updatedTip.limit = e.detail.value }}
      decimals={metadata.decimals}
      class="flex-grow text-right"
      uint
      maxUint={(2n**96n)-1n}
      placeholder="0.0" />
    <Button>${metadata.symbol}</Button>
  </ButtonGroup>
</div>
<div class="flex flex-grow justify-end">
  <Toggle bind:checked />
</div>
<ButtonGroup>
  <DecimalInput
    decimals={0}
    on:update={(e) => { updatedTip.numerator = e.detail.value }}
    uint
    disabled={!checked}
    maxUint={(2n**64n)-1n}
    placeholder="0"
    class="text-right" />
  <button
    disabled
    class="button-inactive">&times;&nbsp;basefee&nbsp;&divide;</button>
  <DecimalInput
    decimals={0}
    on:update={(e) => { updatedTip.denominator = e.detail.value }}
    uint
    disabled={!checked}
    maxUint={(2n**64n)-1n}
    placeholder="0" />
  {#if empty}
  <Button
    color="primary"
    on:click={() => {
      console.log(tip)
    }} >Add&nbsp;Tip<Icon class="ml-2" name="grid-plus-outline" /></Button>
  {/if}
</ButtonGroup>
{/await}

<style lang="postcss">
  .button-inactive {
    @apply text-center font-medium inline-flex items-center justify-center px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-700 border-l-0 first:border-l first:rounded-l-lg last:rounded-r-lg;
  }
</style>
