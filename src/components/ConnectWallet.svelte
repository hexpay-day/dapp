<script lang="ts">
  import * as ethers from 'ethers'
  import { connected, address, facilitateConnect } from '../stores/web3'
  // import * as svelteWagmi from 'svelte-wagmi'
  // import * as wagmiStore from '../stores/wagmi'
  // const { connection, disconnectWagmi, wagmiLoaded, signerAddress, connected, loading, chainId } = svelteWagmi
  // if (typeof global.document !== 'undefined') {
  //   setTimeout(() => {
  //     wagmiStore.configure()
  //   }, 100)
  // }
  const connect = async () => {
    await facilitateConnect()
  }
  const disconnect = async () => {
    // await disconnectWagmi()
  }
  // $: console.log($address)
</script>

{#if $connected}
<button on:click={disconnect}>Disconnect {$address.slice(0, 8)}...{$address.slice(-6)}</button>
{:else}
<button on:click={connect}>Connect</button>
{/if}
