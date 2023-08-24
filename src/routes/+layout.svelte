<script lang="ts">
  import "../app.css";
  import ConnectWallet from '../components/ConnectWallet.svelte'
  import SpeedNav from '../components/SpeedNav.svelte'
  import { page } from '$app/stores';
  import * as web3Store from '../stores/web3'
  import ToggleTimezone from '../components/ToggleTimezone.svelte'
  import {
    DarkMode,
    Dropdown,
    DropdownItem,
    Button,
  } from 'flowbite-svelte'
  import {
    IconSun, IconMoon, IconChevronDown,
  } from '@tabler/icons-svelte'
  import Footer from '../components/Footer.svelte'
	import NavigatingIndicator from "../components/NavigatingIndicator.svelte";

  const {
    chains,
  } = web3Store

  $: dropdownChains = [...chains.entries()].filter(([current]) => $page.data.chainId !== current)
  $: chain = chains.get($page.data.chainId)
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

<div class="container m-auto flex justify-between max-w-5xl h-14 items-center p-2">
  <div class="flex items-center">
    <DarkMode class="text-lg bg-gray-200 dark:bg-gray-600 h-[42px] w-[44px] items-center mr-2">
      <svelte:fragment slot="lightIcon">
        <IconSun class="m-auto" />
      </svelte:fragment>
      <svelte:fragment slot="darkIcon">
        <IconMoon class="m-auto" />
      </svelte:fragment>
    </DarkMode>
    <ToggleTimezone />
    <NavigatingIndicator />
  </div>
  <div class="gap-2 my-1 flex">
    <ConnectWallet />
    <Button class="px-4 py-2">{chain?.name || 'Unknown'}<IconChevronDown class="ml-2 text-white dark:text-white" /></Button> <!-- name="chevron-down-solid"-->
    <Dropdown>
      {#each dropdownChains as [chainId, chain]}
      <DropdownItem>
        <a href="{replaceUrl(chainId)}" class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{chain.name}</a>
      </DropdownItem>
      {/each}
    </Dropdown>
  </div>
</div>
<div class="container m-auto pt-2 px-2 pb-20 max-w-5xl">
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
