<script lang="ts">
	import * as web3Store from "../stores/web3"
	import * as addresses from "../stores/addresses"
	import * as contracts from "../stores/contracts"
	import * as rpcQueries from "../stores/rpc-queries"
  import * as types from '../types'
	import { Button, Spinner } from "flowbite-svelte"
	import { ethers } from "ethers"
	import ConnectWallet from "./ConnectWallet.svelte"
	import _ from "lodash"
	import type { IMulticall3 } from "@hexpayday/stake-manager/artifacts/types";
	import { onMount } from "svelte";
	import { addToSequence } from "../stores/sequence";
  const { chainId, signer, address, connected, numberWithCommas } = web3Store
  let sending = false
  export let existingStakeManagerIsOwner = false
  export let stake!: types.Stake
  $: all = Promise.resolve().then(async () => contracts.all($chainId, await $signer))
  const mounted = new Promise((resolve) => onMount(() => resolve(null)))
  let showSpinner = false
  const approveAll = async (approve: boolean) => {
    showSpinner = true
    try {
      const { hsim } = await all
      const tx = await hsim.setApprovalForAll(addresses.ExistingStakeManager, approve)
      await tx.wait()
      approvalChecksPromise = doApprovalChecks()
    } finally {
      showSpinner = false
    }
  }
  const approveSingle = async (tokenId: bigint, approve: boolean) => {
    showSpinner = true
    try {
      const { hsim } = await all
      const operator = approve ? addresses.ExistingStakeManager : ethers.ZeroAddress
      const tx = await hsim.approve(operator, tokenId)
      await tx.wait()
      approvalChecksPromise = doApprovalChecks()
    } finally {
      showSpinner = false
    }
  }
  const parseResults = async ([isApprovedForAll, getApproved]: IMulticall3.ResultStructOutput[]) => {
    const { hsim } = await all
    return [
      hsim.interface.decodeFunctionResult('isApprovedForAll', isApprovedForAll.returnData)[0],
      ethers.getAddress(hsim.interface.decodeFunctionResult('getApproved', getApproved.returnData)[0]) === ethers.getAddress(addresses.ExistingStakeManager)
    ]
  }
  const doApprovalChecks = async (): Promise<[bigint, boolean, boolean]> => {
    await mounted
    if (existingStakeManagerIsOwner) {
      return [0n, false, false]
    }
    const hexAddress = existingStakeManagerIsOwner
      ? addresses.ExistingStakeManager
      : $address
    const tokenIds = await rpcQueries.getTokenIdsUnder($chainId, hexAddress)
    const tokenIdToHsiAddress = await rpcQueries.getCustodianToTokenIds($chainId, tokenIds)
    const tokenId = tokenIdToHsiAddress.get(ethers.getAddress(stake.custodian)) as bigint
    const { hsim, multicall } = await all
    const approvalChecks = [
      hsim.interface.encodeFunctionData('isApprovedForAll', [
        hexAddress, addresses.ExistingStakeManager,
      ]),
      hsim.interface.encodeFunctionData('getApproved', [
        tokenId,
      ]),
    ].map((callData) => ({
      value: 0,
      target: addresses.HSIM,
      allowFailure: false,
      callData,
    }))
    const [allApproved, singleApproved] = await multicall.aggregate3.staticCall(approvalChecks).then(parseResults)
    return [tokenId, allApproved, singleApproved]
  }
  const addWithdrawToTimeline = () => {
    addToSequence(types.TaskType.withdrawHsi, {
      stake,
    })
  }
  let approvalChecksPromise = doApprovalChecks()
</script>
<div class="flex mx-2">
  {#if $connected}
    {#await approvalChecksPromise}
    <div class="flex px-2">
      <Spinner size="6" />
    </div>
    {:then [tokenId, allApproved, singleApproved]}
      {#if tokenId > 0n}
        {#if allApproved}
        <div class="flex px-2">
          <Button on:click={() => approveAll(false)}>Revoke All</Button>
        </div>
        {:else}
        <div class="flex px-2">
          <Button on:click={() => approveAll(true)}>Approve All</Button>
        </div>
        {/if}
        {#if singleApproved}
        <div class="flex px-2">
          <Button on:click={() => approveSingle(tokenId, false)}>Revoke Approval ({numberWithCommas(tokenId?.toString() || '', '_')})</Button>
        </div>
        {:else}
        <div class="flex px-2">
          <Button on:click={() => approveSingle(tokenId, true)}>Approve Token ({numberWithCommas(tokenId?.toString() || '', '_')})</Button>
        </div>
        {/if}
      {/if}
    {/await}
    {#if showSpinner}
    <div class="flex px-2 items-center">
      <Spinner size="6" />
    </div>
    {/if}
  {:else}
  <ConnectWallet />
  {/if}
  {#if sending}
  <div class="flex px-2">
    <Spinner size="6" />
  </div>
  {/if}
</div>
