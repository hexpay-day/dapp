<!-- <script lang="ts">
  import * as ethers from 'ethers'
  import { writable } from 'svelte/store'
  import { page } from '$app/stores';
  import { address, chainId, signer } from '../stores/web3'
  import { targetDay as days } from '../stores/day'
  import * as addresses from '../stores/addresses'
  import * as contracts from '../stores/contracts'
  import * as settingsStore from '../stores/settings'
  import { fetchData, balance, deposited, isolated } from '../stores/hex'
  import Tip from './Tip.svelte'
  $: fetchData($chainId, $address)
  const restartStake = writable(false)
  const restartStakeWithSameDays = writable(false)
  const tipInHedron = writable(false)
  const tipInHex = writable(false)
  const copyIterations = settingsStore.copyIterations
  const tipMethod = settingsStore.tipMethod
  const hedronTipMethod = settingsStore.hedronTipMethod

  const startStake = () => {}
  const tipOptions = [
    {
      value: 1,
      text: 'constant value',
    },
    {
      value: 3,
      text: 'ratio of total',
    },
    {
      value: 4,
      text: 'ratio of yield',
    },
    {
      value: 5,
      text: 'ratio of principle',
    },
  ]
  const startStakeFromBalance = async () => {
    const s = $signer
    if (!s) {
      return
    }
    const c = contracts.all($chainId, s)
    const balanceBig = await c.hex.connect(s).balanceOf($address)
    const balance = balanceBig.toBigInt()
    const settings = settingsStore.formSettings()
    const encodedSettings = await c.stakeManager.encodeSettings(settings)
    await c.stakeManager.connect(s).stakeStartFromBalanceFor(
      $address,
      balance,
      $days,
      encodedSettings,
    )
  }
  tipInHex.subscribe((value) => {
    tipMethod.update(() => Number(value))
  })
  tipInHedron.subscribe((value) => {
    hedronTipMethod.update(() => Number(value))
  })
</script>
<p>Start a New Optimized <a target="_blank" href="https://etherscan.io/token/{addresses.Hex}">$HEX</a> Stake</p>
<div class="flex">
  Days: <input type="number" bind:value="{$days}" min="1" max="5555" /><input type="range" bind:value="{$days}" min="1" max="5555" /><span>Ends on Day: {BigInt($page.data.day) + 1n + BigInt($days)}</span>
</div>
<div class="flex">
  <label>
    <input type="checkbox" bind:checked={$restartStake} /> Restart Stake
  </label>
  {#if $restartStake}
  <label>
    <input type="checkbox" bind:checked={$restartStakeWithSameDays} /> Use Same Days
  </label>
  <label>
    <input type="number" bind:value={$copyIterations} min="0" max="255" /><input type="range" bind:value={$copyIterations} min="0" max="255" /> How Many Restarts?
  </label>
  {/if}
</div>
<div class="flex">
  <label>
    <input type="checkbox" bind:checked={$tipInHedron} /> Tip $Hedron
  </label>
  {#if $tipInHedron}
  <Tip selected={$hedronTipMethod} options={tipOptions} on:change={(a) => {
    const value = +a.detail.value
    tipInHedron.update(() => !!(+value))
  }} />
  {/if}
</div>
<div class="flex">
  <label>
    <input type="checkbox" bind:checked={$tipInHex} /> Tip $Hex
  </label>
  {#if $tipInHex}
  <Tip selected={$tipMethod} options={tipOptions} on:change={(a) => {
    const value = +a.detail.value
    tipInHex.update(() => !!(+value))
  }} />
  {/if}
</div>
<div>
  <p class="flex">
    <span class="min-w-[250px] whitespace-pre font-mono">Balance:   {ethers.utils.formatUnits($balance || 0n, 8)}</span>
    <button on:click={startStakeFromBalance}>Start Stake (singleton)</button>
    <button on:click={startStake}>Start Stake (isolated)</button>
  </p>
  <p class="flex">
    <span class="min-w-[250px] whitespace-pre font-mono">Deposited: {ethers.utils.formatUnits($deposited || 0n, 8)}</span>
    <button on:click={startStake}>Start Stake</button>
  </p>
  <p class="flex">
    <span class="min-w-[250px] whitespace-pre font-mono">Isolated:  {ethers.utils.formatUnits($isolated || 0n, 8)}</span>
    <button on:click={startStake}>Start Stake</button>
  </p>
</div> -->
