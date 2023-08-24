<script lang="ts">

  import {
    Dropdown,
    DropdownItem,
  } from 'flowbite-svelte'
  import * as web3Store from '../stores/web3'
  import { page } from '$app/stores';

  const {
    chains,
  } = web3Store

  $: dropdownChains = [...chains.entries()].filter(([current]) => $page.data.chainId !== current)
  const replaceUrl = ($chainId: number) => {
    const path = $page.url.pathname
    const [empty, cId, ...remaining] = path.split('/')
    if (!cId || !(+cId) || !remaining.length) {
      // not sure how to handle
      return `/${$chainId}/`
    }
    const url = `${[empty, $chainId, ...remaining].join('/')}`
    return url
  }
</script>
<Dropdown>
  {#each dropdownChains as [chainId, chain]}
  <DropdownItem>
    <a href="{replaceUrl(chainId)}" class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{chain.name}</a>
  </DropdownItem>
  {/each}
</Dropdown>
