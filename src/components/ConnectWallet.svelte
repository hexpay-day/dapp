<script lang="ts">
	import { page } from '$app/stores';
	import { IconLogout } from '@tabler/icons-svelte';
	import { elipsisAddress } from '../stores/addresses';
  import {
    chainId,
    connected,
    connectable,
    address,
    facilitateConnect,
    facilitateDisconnect,
  } from '../stores/web3'
	import { Button, ButtonGroup } from 'flowbite-svelte';
  const connect = async () => {
    await facilitateConnect()
  }
  const disconnect = async () => {
    await facilitateDisconnect()
  }
  $: trulyConnected = $connected && $page.data.chainId === $chainId
</script>

{#if trulyConnected}
<ButtonGroup>
  <Button class="h-[42px]">{elipsisAddress($address)}</Button>
  <Button on:click={disconnect} color="primary" class="px-3">
    <IconLogout size={20} />
  </Button>
</ButtonGroup>
{:else}
<Button class="h-[42px]" disabled={!$connectable} on:click={connect}>Connect</Button>
{/if}
