<script lang="ts">
  import "../../app.css";
  import * as web3Store from '../../stores/web3'
  import { page } from "$app/stores";
	import { get } from "svelte/store";
	import { onDestroy } from "svelte";
  const unsub = page.subscribe(($page) => {
    web3Store.chainId.set($page.data.chainId)
    if (!get(web3Store.intendsToConnect)) return
    web3Store.changeNetworks($page.data.chainId)
  })
  onDestroy(unsub)
</script>

{#if web3Store.chains.has($page.data.chainId)}
<slot />
{:else}
invalid network. change in dropdown or url path
{/if}
