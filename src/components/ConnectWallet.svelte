<script lang="ts">
	import { page } from '$app/stores';
	import { elipsisAddress } from '../stores/addresses';
  import {
    chainId,
    connected,
    address,
    facilitateConnect,
    facilitateDisconnect,
  } from '../stores/web3'
	import { Button } from 'flowbite-svelte';
  const connect = async () => {
    await facilitateConnect()
  }
  const disconnect = async () => {
    await facilitateDisconnect()
  }
  $: trulyConnected = $connected && $page.data.chainId === $chainId
</script>

{#if trulyConnected}
<Button class="h-[42px]" on:click={disconnect}>Disconnect {elipsisAddress($address)}</Button>
{:else}
<Button class="h-[42px]" on:click={connect}>Connect</Button>
{/if}
