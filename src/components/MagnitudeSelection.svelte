<script lang="ts">
  import {
    Label,
    ButtonGroup,
  } from 'flowbite-svelte'
  import IconDropdown from './IconDropdown.svelte'
	import _ from 'lodash';
	import type { DropdownOption, MagnitudeSelection } from '../types';
	import { createEventDispatcher, type SvelteComponent } from 'svelte';
	import { writable } from 'svelte/store';
	import DivisibleInput from './DivisibleInput.svelte';
  export let label: string | SvelteComponent = ''
  export let showDenominatorWhenOver = 0
  export let options: DropdownOption[] = []
  export let nullIsZero = false
  // export let min = 0n
  const dispatch = createEventDispatcher()
  $: option = options[0]
  $: placeholder = option.placeholder || '0'
  let method = 0

  $: selection = {
    method: BigInt(method),
    numerator: 0n,
    denominator: 1n,
  } as {
    method: bigint;
    numerator: bigint;
    denominator: bigint;
  }
  export const value = writable<MagnitudeSelection>(selection)
  $: dispatch('change', { value: selection })
  export let disableInputDuring: number[] = []
  export let disabledDropdownDuring: number[] = []
  export let showDenominatorNever = false
  export let maxUint = 64
  $: maxUintInput = showDenominatorNever || method < showDenominatorWhenOver ? maxUint : maxUint / 2
  const id = _.uniqueId()
  $: showDenominator = !showDenominatorNever && method > showDenominatorWhenOver
  $: numeratorDisabled = disableInputDuring.includes(option.value)
  const onUpdate = (e: any) => {
    const { key, value } = e.detail as unknown as {
      value: bigint | null;
      key: 'numerator' | 'denominator';
    }
    if (_.isNil(value)) {
      return
    }
    selection[key] = value
  }
  $: optionalOptions = options ? { text: option?.inputText } : {}
</script>

<Label class="flex" label="input-{id}">{@html label} <span class="ml-auto leading-5 font-normal font-mono text-xs">{option.text}</span></Label>
<div class="relative flex space-x-2">
  <slot name="before"></slot>
  <div class="flex flex-grow flex-col">
    <ButtonGroup class="font-mono">
      <IconDropdown
        disabled={disabledDropdownDuring.includes(option.value)}
        {options}
        class="border-r-0"
        bind:value={method}
        on:change={(e) => {
          option = e.detail.value
        }} />
      <DivisibleInput
        {numeratorDisabled}
        {showDenominator}
        {nullIsZero}
        {placeholder}
        {...optionalOptions}
        maxUint={maxUintInput}
        on:update={onUpdate} />
    </ButtonGroup>
  </div>
</div>
