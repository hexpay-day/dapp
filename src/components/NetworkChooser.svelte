<script lang="ts">
  import {
    Dropdown,
    DropdownItem,
    Button,
  } from 'flowbite-svelte'
  import * as web3Store from '../stores/web3'
  import { page } from '$app/stores';
  import {
    IconChevronDown,
  } from '@tabler/icons-svelte'
  const {
    chains,
  } = web3Store

  $: dropdownChains = [...chains.entries()].filter(([current]) => $page.data.chainId !== current)
  $: chain = chains.get($page.data.chainId)
</script>

<Button class="px-4 py-2">{chain?.name || 'Unknown'}<IconChevronDown class="ml-2 text-white dark:text-white" /></Button>
<Dropdown>
  {#each dropdownChains as [chainId, chain]}
  <DropdownItem href="{web3Store.replaceUrl(chainId, $page.url.pathname)}">{chain.name}</DropdownItem>
  {/each}
</Dropdown>
