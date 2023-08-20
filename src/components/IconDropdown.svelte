<script lang="ts">
  import {
    Button,
    Dropdown,
    DropdownItem,
  } from 'flowbite-svelte'
  import { Icon } from 'flowbite-svelte-icons';
  let dropdownOpen = false
  type Option = {
    value: number;
    text: string;
  }
  export let options: Option[] = []
  export let value = options[0].value
</script>

<div class="flex flex-col relative">
  <Button class="border-[1px]"><Icon name="adjustments-horizontal-outline" /></Button>
  <Dropdown placement="bottom-start" bind:open={dropdownOpen}>
    {#each options as opt}
    <DropdownItem on:click={() => {
      value = opt.value;
      dropdownOpen = false;
    }}>{opt.text}</DropdownItem>
    {/each}
  </Dropdown>
</div>

<style lang="postcss">
  :global([role=tooltip]) {
    @apply z-10;
  }
</style>
