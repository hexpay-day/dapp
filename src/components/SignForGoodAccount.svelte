<script lang="ts">
	import * as web3Store from "../stores/web3";
  import * as backend from '../stores/backend'
  import type * as types from '../types'
	import { Button, Spinner } from "flowbite-svelte";
	import { invalidateAll } from "$app/navigation";
  const { chainId } = web3Store
  let sending = false
  export let stake!: types.Stake
  const signAndSend = async () => {
    const days30 = 30*24*60*60
    const validStart = Math.floor(+(new Date()) / 1_000)
    const validUntil = validStart + days30
    const options = {
      chainId: $chainId,
      stakeId: stake.stakeId,
      validStart,
      validUntil,
    }
    const typedRequest = backend.create712Message.requestGoodAccount(options)
    sending = true
    const signature = await web3Store.sign712Message(typedRequest)
    if (!signature) {
      sending = false
      return
    }
    await backend.storeSignature({
      signature,
      ...options,
    })
    await invalidateAll()
    sending = false
  }
</script>
<div class="flex mx-2">
  {#if !stake.requestedGoodAccounting}
  <Button on:click={signAndSend}>Request</Button>
  {/if}
  {#if sending}
  <div class="flex p-2">
    <Spinner size="6" />
  </div>
  {/if}
</div>
