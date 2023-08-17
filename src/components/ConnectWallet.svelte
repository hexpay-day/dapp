<script lang="ts">
  import { connected, address, facilitateConnect } from '../stores/web3'
	import { Button } from 'flowbite-svelte';
  const connect = async () => {
    await facilitateConnect()
  }
  const disconnect = async () => {
    // await disconnectWagmi()
  }
  // $: console.log($address)
</script>

{#if $connected}
<Button on:click={disconnect}>Disconnect {$address.slice(0, 8)}...{$address.slice(-6)}</Button>
{:else}
<Button on:click={connect}>Connect</Button>
{/if}
