<script lang="ts">
  import "../app.css";
  import ConnectWallet from '../components/ConnectWallet.svelte'
  import { page } from '$app/stores';
  import * as web3Store from '../stores/web3'
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

  $: dropdownChains = [...web3Store.chains.entries()].filter(([current]) => $page.data.chainId !== current)
</script>

<div>
  <div class="container m-auto flex justify-between">
    <div class="m-1">
      <DarkMode />
      <NavigatingIndicator />
    </div>
    <div class="gap-2 my-1">
      <ConnectWallet />
      <Button>{web3Store.chains.get($page.data.chainId)}<Icon name="chevron-down-solid" class="w-3 h-3 ml-2 text-white dark:text-white" /></Button>
      <Dropdown>
        {#each dropdownChains as [chainId, name]}
        <DropdownItem>
          <a href="/{chainId}/" class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{name}</a>
        </DropdownItem>
        {/each}
      </Dropdown>
    </div>
  </div>
  <div class="container m-auto py-2">
    <slot />
  </div>
  <Footer />
</div>

<style lang="postcss">
  :global(html) {
    height: 100%;
  }
  :global(html, body) {
    min-height: 100%;
  }
</style>
<!-- <script>
  import "../app.css";
</script>

<slot /> -->
