<script lang="ts">
  import {
    Button,
    Dropdown,
    DropdownItem,
  } from 'flowbite-svelte'
  import { IconAdjustments } from '@tabler/icons-svelte'
	import type { DropdownOption } from '../types';
	import { createEventDispatcher } from 'svelte';
  let dropdownOpen = false
  export let options: DropdownOption[] = []
  export let value = options[0].value
  let className = ''
  export { className as class }
  export let disabled = false
  const dispatch = createEventDispatcher();
</script>

<Button {disabled} class={className}><IconAdjustments /></Button> <!-- size="sm" name="adjustments-horizontal-outline"-->
{#if !disabled}
<Dropdown placement="bottom-start" bind:open={dropdownOpen}>
  {#each options.filter((opt) => opt.value !== value) as opt}
  <DropdownItem on:click={() => {
    value = opt.value;
    dropdownOpen = false;
    dispatch('change', {
      value: opt,
    })
  }}>{opt.text}</DropdownItem>
  {/each}
</Dropdown>
{/if}
