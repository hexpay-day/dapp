<script lang="ts">
  import "../app.css";
  import ConnectWallet from '../components/ConnectWallet.svelte'
  import { page } from '$app/stores';
  import {
    DarkMode,
    Footer,
    FooterCopyright,
    Dropdown,
    DropdownItem,
    Button,
  } from 'flowbite-svelte'
  import {
    Icon,
  } from 'flowbite-svelte-icons'

  const chains = new Map<number, string>([
    [1, 'Ethereum'],
    [369, 'Pulsechain'],
    [943, 'Pulsechain Testnet'],
  ])

  $: dropdownChains = [...chains.entries()].filter(([current]) => $page.data.chainId !== current)
</script>

<div class="pb-16">
  <div class="container m-auto">
    <DarkMode />
    <ConnectWallet />

    <Button>{chains.get($page.data.chainId)}<Icon name="chevron-down-solid" class="w-3 h-3 ml-2 text-white dark:text-white" /></Button>
    <Dropdown>
      {#each dropdownChains as [chainId, name]}
        <DropdownItem>
          <a href="/{chainId}/" class="block hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{name}</a>
        </DropdownItem>
      {/each}
    </Dropdown>
  </div>
  <div class="container m-auto">
    <slot />
  </div>
  <Footer class="fixed bottom-0 left-0 w-full rounded-none">
    <div class="container m-auto">
      <FooterCopyright href="/" by="HexPay.Day" year={(new Date()).getFullYear()} />
    </div>
  </Footer>
  <!-- add a little extra spacing -->
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
