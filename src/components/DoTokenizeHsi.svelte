<script lang="ts">
	import * as backend from "../stores/backend"
	import * as web3Store from "../stores/web3"
	import * as contracts from "../stores/contracts"
  import type * as types from '../types'
	import { Button, Spinner } from "flowbite-svelte"
	import { ethers } from "ethers"
	import ConnectWallet from "./ConnectWallet.svelte"
	import _ from "lodash"
	import { invalidateAll } from "$app/navigation";
  const { chainId, signer, address } = web3Store
  let sending = false
  export let stake!: types.Stake
  $: s = $signer as ethers.providers.JsonRpcSigner
  const tokenizeHsi = async () => {
    sending = true
    try {
      const all = contracts.all($chainId, s)
      const count = await all.hsim.hsiCount(s.getAddress())
      const calls = _.range(0, count.toNumber()).map((_v, index) => ({
        value: 0,
        allowFailure: false,
        target: all.hsim.address,
        callData: all.hsim.interface.encodeFunctionData('hsiLists', [
          $address, index,
        ]),
      }))
      const results = await all.multicall.callStatic.aggregate3(calls)
      const hsiList = results.map((result) => (
        all.hsim.interface.decodeFunctionResult('hsiLists', result.returnData)[0] as string
      ))
      const hsiIndex = _.findIndex(hsiList, (hsiAddress) => (
        ethers.utils.getAddress(hsiAddress) === ethers.utils.getAddress(stake.custodian)
      ))
      console.log(hsiIndex, stake.custodian)
      const tx = await all.hsim.hexStakeTokenize(hsiIndex, stake.custodian, {
        type: 2,
      })
      const receipt = await tx.wait()
      await backend.clearCache({
        chainId: $chainId,
        account: $address,
        hash: receipt.transactionHash,
      })
      console.log('transaction mined %o', receipt.transactionHash)
      await invalidateAll().then(() => {
        console.log('updated')
      })
    } catch (err) {
      console.log(err)
    } finally {
      sending = false
    }
  }
</script>
<div class="flex mx-2">
  {#if $address !== ethers.constants.AddressZero}
  <Button on:click={tokenizeHsi}>Tokenize</Button>
  {:else}
  <ConnectWallet />
  {/if}
  {#if sending}
  <div class="flex p-2">
    <Spinner size="6" />
  </div>
  {/if}
</div>
