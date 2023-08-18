<script lang="ts">
  import "../app.css";
  import ConnectWallet from '../components/ConnectWallet.svelte'
  import { page } from '$app/stores';
  import * as web3Store from '../stores/web3'
  import {
    DarkMode,
    Footer,
    FooterCopyright,
    Dropdown,
    DropdownItem,
    Button,
    Spinner,
  } from 'flowbite-svelte'
  import {
    Icon,
  } from 'flowbite-svelte-icons'
	import { today } from "../stores/filters";
  import { navigating } from '$app/stores';

  $: dropdownChains = [...web3Store.chains.entries()].filter(([current]) => $page.data.chainId !== current)
</script>

<div class="pb-16">
  <div class="container m-auto flex justify-between">
    <div class="m-1">
      <DarkMode />
      {#if $navigating}
      <Spinner size="6" />
      {/if}
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
  <Footer class="fixed bottom-0 left-0 w-full rounded-none">
    <div class="container m-auto">
      <FooterCopyright href="/" by="HexPay.Day" year={today().getFullYear()} />
    </div>
  </Footer>
  <div class="w-full h-4"></div>
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
