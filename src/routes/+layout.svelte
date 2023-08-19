<script lang="ts">
  import "../app.css";
  import ConnectWallet from '../components/ConnectWallet.svelte'
  import SpeedNav from '../components/SpeedNav.svelte'
  import { page } from '$app/stores';
  import * as web3Store from '../stores/web3'
  import type { Chain } from '@wagmi/core'
  import {
    DarkMode,
    Dropdown,
    DropdownItem,
    Button,
  } from 'flowbite-svelte'
  import {
    Icon,
  } from 'flowbite-svelte-icons'
  import Footer from '../components/Footer.svelte'
	import NavigatingIndicator from "../components/NavigatingIndicator.svelte";
  const {
    chains,
  } = web3Store

  $: dropdownChains = [...chains.entries()].filter(([current]) => $page.data.chainId !== current)
  // $: console.log(dropdownChains)
  $: chain = chains.get($page.data.chainId)
</script>

<div class="container m-auto flex justify-between px-2">
  <div class="m-1">
    <DarkMode />
    <NavigatingIndicator />
  </div>
  <div class="gap-2 my-1">
    <ConnectWallet />
    <Button>{chain?.name || 'Unknown'}<Icon name="chevron-down-solid" class="w-3 h-3 ml-2 text-white dark:text-white" /></Button>
    <Dropdown>
      {#each dropdownChains as [chainId, chain]}
      <DropdownItem>
        <a href="/{chainId}/" class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{chain.name}</a>
      </DropdownItem>
      {/each}
    </Dropdown>
  </div>
</div>
<div class="container m-auto pt-2 px-2 pb-20">
  <slot />
</div>
<SpeedNav />
<Footer />

<style lang="postcss">
  :global(html) {
    height: 100%;
  }
  :global(html, body) {
    min-height: 100%;
  }
</style>
