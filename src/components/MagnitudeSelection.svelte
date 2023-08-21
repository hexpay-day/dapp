<script lang="ts">
  import {
    Label,
    ButtonGroup,
  } from 'flowbite-svelte'
  import DecimalInput from './DecimalInput.svelte'
  import IconDropdown from './IconDropdown.svelte'
	import _ from 'lodash';
	import type { DropdownOption, MagnitudeSelection } from '../types';
	import { createEventDispatcher, type SvelteComponent } from 'svelte';
	import { writable } from 'svelte/store';
  export let label: string | SvelteComponent = ''
  export let showDenominatorWhenOver = 0
  export let options: DropdownOption[] = []
  const dispatch = createEventDispatcher()
  let option: DropdownOption = options[0]
  let method = 0

  $: selection = {
    method: BigInt(method),
    numerator: 0n,
    denominator: 1n,
  }
  export const value = writable<MagnitudeSelection>(selection)
  $: dispatch('change', { value: selection })
  export let disableInputDuring: number[] = []
  export let disabledDropdownDuring: number[] = []
  export let showDenominatorNever = false
  export let maxUint = 64
  $: maxUintInput = showDenominatorNever || method < showDenominatorWhenOver ? maxUint : maxUint / 2
  $: maxUintBigInt = (2n ** BigInt(maxUintInput)) - 1n
  const id = _.uniqueId()
  $: showingDenominator = !showDenominatorNever && method > showDenominatorWhenOver
</script>

<Label class="flex" label="input-{id}">{@html label} <span class="ml-auto leading-5 font-normal font-mono text-xs">{option.text}</span></Label>
<div class="relative flex space-x-2">
  <slot name="before"></slot>
  <div class="flex flex-grow flex-col">
    <ButtonGroup class="font-mono">
      <IconDropdown disabled={disabledDropdownDuring.includes(option.value)} {options} class="border-r-0" bind:value={method} on:change={(e) => {
        option = e.detail.value
      }} />
      <DecimalInput
        disabled={disableInputDuring.includes(option.value)}
        placeholder={'0'}
        zeroIsNull
        uint
        maxUint={maxUintBigInt}
        class="text-right"
        decimals={0}
        id={`magnitude-selection-input-${id}`}
        on:update={(e) => { selection.numerator = e.detail.value }} />
      {#if showingDenominator}
      <button class="button-inactive" disabled>&divide;</button>
      <DecimalInput
        placeholder={'0'}
        uint
        maxUint={maxUintBigInt}
        decimals={0}
        defaultText={'1'}
        validate={(val) => val > 0n && val < maxUint}
        on:update={(e) => { selection.denominator = e.detail.value }} />
        <button class="button-inactive" disabled>=&nbsp;%</button>
      {/if}
    </ButtonGroup>
  </div>
</div>

<style lang="postcss">
  .button-inactive {
    @apply text-center font-medium inline-flex items-center justify-center px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-700 border-l-0 first:border-l first:rounded-l-lg last:rounded-r-lg;
  }
</style>
