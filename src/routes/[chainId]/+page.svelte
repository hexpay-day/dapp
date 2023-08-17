<script lang="ts">
  import { page } from '$app/stores';
  import {
    Dropdown,
    DropdownItem,
    Button,
  } from 'flowbite-svelte'
  import {
    Icon,
  } from 'flowbite-svelte-icons'
  import Filters from '../../components/Filters.svelte'

  const chains = new Map<number, string>([
    [1, 'Ethereum'],
    [369, 'Pulsechain'],
    [943, 'Pulsechain Testnet'],
  ])

  $: dropdownChains = [...chains.entries()].filter(([current]) => $page.data.chainId !== current)
</script>

<Button>{chains.get($page.data.chainId)}<Icon name="chevron-down-solid" class="w-3 h-3 ml-2 text-white dark:text-white" /></Button>
<Dropdown>
  {#each dropdownChains as [chainId, name]}
    <DropdownItem>
      <a href="/{chainId}/" class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{name}</a>
    </DropdownItem>
  {/each}
</Dropdown>

<div class="container">
  <Filters />
</div>
