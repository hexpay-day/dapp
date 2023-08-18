<script lang="ts">
  import "../../app.css";
  import * as web3Store from '../../stores/web3'
  import { page } from "$app/stores";
  $: web3Store.chainId.set($page.data.chainId)
  $: chainId = web3Store.chainId
</script>

{#if web3Store.chains.has($chainId)}
<slot />
{:else}
invalid network. change in dropdown or url path
{/if}