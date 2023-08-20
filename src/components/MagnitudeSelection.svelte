<script lang="ts">
  import {
    Label,
    Helper,
  } from 'flowbite-svelte'
  import DecimalInput from './DecimalInput.svelte'
  import IconDropdown from './IconDropdown.svelte'
	import _ from 'lodash';
	import type { DropdownOption } from '../types';
  export let label = ''
  export let showDenominatorWhenOver = 0
  export let options: DropdownOption[] = []
  let tipMethod = options[0].value
  let numeratorValue: null | bigint = null
  let denominatorValue: null | bigint = 1n
  const id = _.uniqueId()
</script>

<div class="flex flex-col">
  <Label label="input-{id}">{label}</Label>
  <div class="relative flex space-x-2">
    <IconDropdown {options} bind:value={tipMethod} />
    <div class="flex flex-grow flex-col">
      <DecimalInput
        placeholder={'0'}
        zeroIsNull
        uint
        decimals={0}
        id={`magnitude-selection-input-${id}`}
        on:update={(e) => {
          numeratorValue = e.detail.value
        }} />
        {#if tipMethod !== 1}
        <Helper>Numerator (x/1)</Helper>
        {:else}
        <Helper>&NonBreakingSpace;</Helper>
        {/if}
    </div>
    {#if tipMethod > showDenominatorWhenOver}
    <div class="flex flex-grow flex-col">
      <DecimalInput
        placeholder={'0'}
        uint
        decimals={0}
        defaultText={'1'}
        validate={(val) => val > 0n}
        on:update={(e) => {
          denominatorValue = e.detail.value
        }} />
        <Helper>Denominator (1/x)</Helper>
    </div>
    {/if}
  </div>
</div>