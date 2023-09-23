<script lang="ts">
	import { page } from '$app/stores';
	import { IconLogout } from '@tabler/icons-svelte';
  import Address from './Address.svelte'
  import {
    intendsToConnect,
    clickedConnect,
    connected,
    connectable,
    address,
    facilitateConnect,
    facilitateDisconnect,
  } from '../stores/web3'
	import { Button, ButtonGroup } from 'flowbite-svelte';
  const connect = async () => {
    clickedConnect.set(true)
    await facilitateConnect($page.data.chainId)
  }
  const disconnect = async () => {
    clickedConnect.set(true)
    await facilitateDisconnect()
  }
</script>

{#if $connected && $intendsToConnect}
<ButtonGroup>
  <Button class="h-[42px]"><Address address={$address} ellipsis /></Button>
  <Button on:click={disconnect} color="primary" class="px-3">
    <IconLogout size={20} />
  </Button>
</ButtonGroup>
{:else}
<Button class="h-[42px]" disabled={!$connectable} on:click={connect}>Connect</Button>
{/if}
