<script lang="ts">
  import "../app.css";
  import ConnectWallet from '../components/ConnectWallet.svelte'
  import SpeedNav from '../components/SpeedNav.svelte'
  import { page } from '$app/stores';
  import * as web3Store from '../stores/web3'
  import ToggleTimezone from '../components/ToggleTimezone.svelte'
  import {
    DarkMode,
    Button,
  } from 'flowbite-svelte'
  import {
    IconChevronDown,
  } from '@tabler/icons-svelte'
  import Footer from '../components/Footer.svelte'
	import NavigatingIndicator from "../components/NavigatingIndicator.svelte";
  import NetworkChooser from '../components/NetworkChooser.svelte'

  const {
    chains,
  } = web3Store

  $: chain = chains.get($page.data.chainId)
</script>

<div class="container m-auto flex justify-between max-w-5xl h-14 items-center p-2">
  <div class="flex items-center">
    <DarkMode />
    <ToggleTimezone />
    <NavigatingIndicator />
  </div>
  <div class="gap-2 my-1 flex">
    <ConnectWallet />
    <Button class="px-4 py-2">{chain?.name || 'Unknown'}<IconChevronDown class="ml-2 text-white dark:text-white" /></Button>
    <NetworkChooser />
  </div>
</div>
<div class="container m-auto pt-2 px-2 pb-20 max-w-5xl">
  <slot />
</div>
<SpeedNav />
<Footer />
