<script lang="ts">
	import { elipsisAddress } from '../stores/addresses';
  import * as web3Store from '../stores/web3'
	import { Button } from 'flowbite-svelte';
  const connect = async () => {
    await web3Store.facilitateConnect()
  }
  const disconnect = async () => {
    await web3Store.facilitateDisconnect()
  }
  $: connected = web3Store.connected
  $: address = web3Store.address
</script>

{#if $connected}
<Button on:click={disconnect}>Disconnect {elipsisAddress($address)}</Button>
{:else}
<Button on:click={connect}>Connect</Button>
{/if}
