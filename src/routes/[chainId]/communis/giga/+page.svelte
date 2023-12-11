<script lang="ts">
  import * as ethers from 'ethers'
	import { Button, ButtonGroup } from "flowbite-svelte";
  import * as contracts from '../../../../stores/contracts'
  import * as web3Store from '../../../../stores/web3'
  import * as addresses from '../../../../stores/addresses'
	import { get, writable } from "svelte/store";
  import * as communisStore from "../../../../stores/communis";
	import DecimalInput from "../../../../components/DecimalInput.svelte";
	import { IconChevronLeft, IconChevronRight, IconCopy, IconExternalLink } from "@tabler/icons-svelte";
	import Address from "../../../../components/Address.svelte";
  import * as linkStore from '../../../../stores/links'
	import { loading } from '../../../../stores/loading';
  const { bridge } = linkStore
  const { chainId, signer } = web3Store
  const { allowance, balanceCOMM, balanceGCOMM } = communisStore
  const uint256 = (2n**256n)-1n
  const factor = 10n**9n
  const decimals = 12
  const options = {
    type: 2,
  }
  const setApproval = async (amount = 0n) => {
    const signer = await get(web3Store.signer)
    const all = contracts.all($chainId, signer)
    loading.increment()
    try {
      const tx = await all.communis.approve(
        await all.gcomm.getAddress(),
        amount,
        options,
      )
      await tx.wait()
    } finally{
      loading.decrement()
    }
  }
  let approval = writable(0n)
  allowance.subscribe((val) => {
    approval.set(val)
  })
  let mint = writable(0n)
  balanceCOMM.subscribe((val) => {
    mint.set(val / factor)
  })
  let burn = writable(0n)
  balanceGCOMM.subscribe((val) => {
    burn.set(val)
  })
  const runApproval = () => setApproval($approval)
  const runMint = async () => {
    const signer = await get(web3Store.signer)
    const all = contracts.all($chainId, signer)
    loading.increment()
    try {
      const tx = await all.gcomm.mint($mint, options)
      await tx.wait()
    } finally {
      loading.decrement()
    }
  }
  const runBurn = async () => {
    const signer = await get(web3Store.signer)
    const all = contracts.all($chainId, signer)
    loading.increment()
    try {
      const tx = await all.gcomm.burn($mint, options)
      await tx.wait()
    } finally {
      loading.decrement()
    }
  }
  const copyGCommAddress = async () => {
    await navigator.clipboard.writeText(addresses.GigaCommunis)
  }
  const keypressCopy = async (e: unknown) => {
    if ((e as KeyboardEvent).key === 'Enter') {
      await copyGCommAddress()
    }
  }
  const setApprovalToMax = () => {
    approval.set(uint256)
  }
  const openBridgeUrl = () => {
    if (!$bridge) return
    open($bridge, '_blank')
  }
</script>

<div class="container m-auto flex justify-between max-w-3xl flex-col gap-2">
  <div class="flex flex-col w-full">
    <ButtonGroup class="grow">
      <DecimalInput
        {decimals}
        max={uint256}
        placeholder="0.0"
        on:update={(e) => { approval.set(e.detail.value) }}
        text={ethers.formatUnits($approval, decimals)} />
      <Button
        class="px-3"
        color="alternative"
        disabled={$approval === uint256}
        on:click={setApprovalToMax}>MAX</Button>
      <Button
        class="min-w-[100px]"
        color="primary"
        disabled={!$signer || $approval === $allowance}
        on:click={runApproval}>{$approval === 0n ? 'Revoke' : 'Approve'}</Button>
    </ButtonGroup>
    <div class="flex my-2 items-center">
      <IconChevronLeft class="min-w-fit inline-block" />
      <span title={ethers.formatUnits($allowance, decimals)} class="inline-block text-sm">{ethers.formatUnits($allowance, decimals)} $gCOMM</span>
    </div>
  </div>
  <div class="flex flex-col w-full">
    <ButtonGroup class="grow">
      <DecimalInput
        {decimals}
        text={ethers.formatUnits($mint, decimals)}
        max={$balanceCOMM / factor}
        on:update={(e) => { mint.set(e.detail.value) }} />
      <Button
        class="px-3"
        color="alternative"
        disabled={$mint === $balanceCOMM / factor || $balanceCOMM / factor === 0n}
        on:click={() => mint.set($balanceCOMM)}>MAX</Button>
      <Button
        color="primary" class="min-w-[100px]"
        disabled={!$signer || $mint === 0n}
        on:click={runMint}>Mint</Button>
    </ButtonGroup>
    <div class="flex my-2 items-center">
      <span class="text-sm">{ethers.formatUnits($mint * factor, decimals)} $COMM</span>
      <IconChevronRight />
      <span title={ethers.formatUnits($mint, decimals)} class="inline-block text-sm overflow-hidden whitespace-nowrap text-ellipsis">{ethers.formatUnits($mint, decimals)} $gCOMM</span>
    </div>
  </div>
  <div class="flex flex-col w-full">
    <ButtonGroup class="grow">
      <DecimalInput
        {decimals}
        text={ethers.formatUnits($burn, 12)}
        max={$balanceGCOMM}
        on:update={(e) => { burn.set(e.detail.value) }} />
      <Button
        class="px-3"
        color="alternative"
        disabled={$burn === $balanceGCOMM || $burn === 0n}
        on:click={() => burn.set($balanceGCOMM)}>MAX</Button>
      <Button
        color="primary"
        class="min-w-[100px]"
        disabled={!$signer || $burn === 0n}
        on:click={runBurn}>Burn</Button>
    </ButtonGroup>
    <div class="flex my-2 items-center">
      <span class="text-sm">{ethers.formatUnits($burn, decimals)} $gCOMM</span>
      <IconChevronRight />
      <span title={ethers.formatUnits($burn * factor, decimals)} class="inline-block text-sm overflow-hidden whitespace-nowrap text-ellipsis">{ethers.formatUnits($burn * factor, decimals)}&nbsp;$COMM</span>
    </div>
  </div>
  <div class="flex flex-row w-full items-baseline">
    <ButtonGroup divClass="flex flex-row h-[42px] grow">
      <Button class="flex flex-row grow" role="none" on:click={copyGCommAddress} on:keypress={keypressCopy}>
        <Address address={addresses.GigaCommunis} ellipsis />
        <IconCopy class="mx-2" />
        <span>$gCOMM</span>
      </Button>
      <Button
        color="primary"
        class="grow"
        on:click={openBridgeUrl}
        disabled={!$bridge}>Bridge to Pulsechain <IconExternalLink class="mx-2" /></Button>
    </ButtonGroup>
  </div>
</div>
