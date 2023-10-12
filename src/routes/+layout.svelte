<script lang="ts">
  import "../app.css";
  import ConnectWallet from '../components/ConnectWallet.svelte'
  import SpeedNav from '../components/SpeedNav.svelte'
  import { page } from '$app/stores';
  import Settings from '../components/Settings.svelte'
  import Footer from '../components/Footer.svelte'
	import NavigatingIndicator from "../components/NavigatingIndicator.svelte";
  import NetworkChooser from '../components/NetworkChooser.svelte'
  import { Banner } from 'flowbite-svelte';
	import { IconTool } from "@tabler/icons-svelte";
</script>

<Banner dismissable={false}>
  <div class="container m-auto">Site is in alpha stages! <IconTool class="inline-block" /> Enjoy the docs, poke around, but don't expect anything to work :)</div>
</Banner>
<div class="m-auto flex justify-center h-14 items-center px-2">
  <div class="flex justify-between max-w-5xl w-full">
    <div class="flex items-center">
      <Settings />
      <div class="mx-2">
        <NavigatingIndicator />
      </div>
    </div>
    <div class="gap-2 my-1 flex">
      {#if $page.data.chainId}
      <ConnectWallet />
      {/if}
      <NetworkChooser />
    </div>
  </div>
</div>
<div class="flex flex-col py-10">
  <slot />
</div>
<SpeedNav />
<Footer />
