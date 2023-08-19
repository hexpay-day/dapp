<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let selected: string | number | null = null
  export let options: {value: string | number, text: string}[] = []
  // $: console.log(selected)
  const dispatch = createEventDispatcher()
</script>
<div class="flex">
  <select bind:value={selected} on:change={(e) => {
    dispatch('change', {
      value: e?.currentTarget?.value || '',
    })
  }}>
    {#each options as opt}
    <option value={opt.value}>{opt.text}</option>
    {/each}
  </select>
</div>
