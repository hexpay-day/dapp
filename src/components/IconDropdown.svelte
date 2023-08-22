<script lang="ts">
  import {
    Button,
    Dropdown,
    DropdownItem,
  } from 'flowbite-svelte'
  import { Icon } from 'flowbite-svelte-icons';
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

<Button {disabled} class={className}><Icon size="sm" name="adjustments-horizontal-outline" /></Button>
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

<style lang="postcss">
  :global([role=tooltip]) {
    @apply z-20;
  }
</style>
