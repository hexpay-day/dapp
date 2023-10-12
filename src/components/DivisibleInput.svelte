<script lang="ts">
	import { ethers } from "ethers";
  import DecimalInput from "./DecimalInput.svelte";
	import { SvelteComponent, createEventDispatcher } from "svelte";
	import _ from "lodash";
  export let numeratorDisabled = false
  export let max = ethers.MaxUint256
  export let min = 0n
  export let showDenominator = false
  export let maxUint = 256
  export let nullIsZero = false
  export let text = ''
  export let placeholder = '0'
  let numerator!: SvelteComponent
  $: {
    numerator?.$set({
      text: text || '',
    })
  }
  export let id = _.uniqueId('divisible-input')
  $: maxUintBigInt = (2n ** BigInt(maxUint)) - 1n
  const dispatch = createEventDispatcher()
  const onUpdate = (key: string) => (e: any) => {
    const value = e.detail.value
    dispatch('update', {
      key,
      value,
    })
  }
  const updateNumerator = onUpdate('numerator')
  const updateDenominator = onUpdate('denominator')
</script>

<DecimalInput
  bind:this={numerator}
  disabled={numeratorDisabled}
  {placeholder}
  zeroIsNull
  {nullIsZero}
  uint
  maxUint={maxUintBigInt}
  {max}
  {min}
  class="text-right"
  decimals={0}
  id={`${id}-numerator`}
  defaultText={text}
  on:update={updateNumerator} />
{#if showDenominator}
<button class="button-inactive" disabled>&divide;</button>
<DecimalInput
  {placeholder}
  uint
  maxUint={maxUintBigInt}
  {max}
  min={1n}
  decimals={0}
  id={`${id}-denominator`}
  defaultText={'1'}
  on:update={updateDenominator} />
<button class="button-inactive" disabled>=&nbsp;%</button>
{/if}
<style lang="postcss">
  .button-inactive {
    @apply text-center font-medium inline-flex items-center justify-center px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-700 border-l-0 first:border-l first:rounded-l-lg last:rounded-r-lg;
  }
</style>
