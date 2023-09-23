<script lang="ts">
  import { Toggle } from "flowbite-svelte";
	import type { Step } from "../types";
	import { updateSequenceItem, estimateGas, defaultAccessListResponse } from "../stores/sequence";
	import { numberWithCommas } from "../stores/web3";
  export let step: Step
  export let isFirst: boolean

  const changeHandler = (e: any) => {
    updateSequenceItem(step, {
      optimize: (e.target as HTMLInputElement)?.checked,
    })
  }
  let estimate = {
    gasUsed: 0n,
    optimized: {
      ...defaultAccessListResponse,
    },
  }
  if (isFirst) {
    estimateGas(step).then((used) => {
      estimate = used
    })
  }
  // disabled only for approval so far because it is derived
  const disabled = step.id === 'approval'
</script>
{#if isFirst}
<div class="flex flex-row justify-between my-2">
  <span class="flex" class:cursor-not-allowed={disabled}>
    Optimize
    <Toggle class="ml-2" {disabled} checked={step.optimize} on:change={changeHandler} />
    <span class="flex" class:line-through={estimate.optimized.gasUsed > 0n}>
      {numberWithCommas(estimate.gasUsed.toString())}
    </span>
    {#if estimate.optimized.gasUsed > 0n}
    <span class="flex mx-2">
      {numberWithCommas(estimate.gasUsed.toString())}
    </span>
    {/if}
    <span class="flex mx-1">gas</span>
  </span>
</div>
{/if}
