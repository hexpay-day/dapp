<script lang="ts">
  import "../../app.css";
  import * as web3Store from '../../stores/web3'
  import { page } from "$app/stores";
	import { onMount } from "svelte";
  const { chainId, connected } = web3Store
  $: $connected && chainId.subscribe(async (value) => {
    if ($page.data.chainId === value) {
      return
    }
    await web3Store.changeNetworks($page.data.chainId)
    // await goto(path)
  })
  onMount(() => {
    web3Store.facilitateConnect()
  })
  web3Store.setChainIdIfNot($page.data.chainId)
  // $: cId = web3Store.chains.has($chainId)
</script>

{#if web3Store.chains.has($page.data.chainId)}
<slot />
{:else}
invalid network. change in dropdown or url path
{/if}
