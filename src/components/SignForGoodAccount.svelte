<script lang="ts">
	import * as web3Store from "../stores/web3";
  import * as backend from '../stores/backend'
  import type * as types from '../types'
	import { Button, Spinner } from "flowbite-svelte";
	import { createEventDispatcher } from "svelte";
	import ConnectWallet from "./ConnectWallet.svelte";
  const { chainId, connected, address } = web3Store
  const dispatch = createEventDispatcher()
  let sending = false
  export let stake!: types.Stake
  const signAndSend = async () => {
    const days30 = 30*24*60*60
    const validStart = Math.floor(+(new Date()) / 1_000)
    const validUntil = validStart + days30
    const options = {
      chainId: $chainId,
      custodian: stake.isHedron ? stake.custodian : stake.owner,
      stakeId: stake.stakeId,
      validStart,
      validUntil,
    }
    const typedRequest = backend.create712Message.requestGoodAccount(options)
    sending = true
    let successful = false
    try {
      const signature = await web3Store.sign712Message(typedRequest)
      if (signature) {
        successful = await backend.storeSignature({
          signature,
          ...options,
        })
      }
    } finally {
      sending = false
      if (successful) dispatch('requested')
    }
  }
</script>
<div class="flex mx-2">
  {#if $connected}
    {#if !stake.requestedGoodAccounting && stake.owner === $address}
      <Button on:click={signAndSend}>Request</Button>
    {/if}
  {:else}
    <ConnectWallet />
  {/if}
  {#if sending}
  <div class="flex p-2">
    <Spinner size="6" />
  </div>
  {/if}
</div>
