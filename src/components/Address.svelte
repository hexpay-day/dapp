<script lang="ts">
	import { ellipsisAddress } from "../stores/addresses";

  export let address!: string | Promise<string>
  export let ellipsis = false
  type Sizes = 'sm' | 'md'
  export let size: Sizes = 'md'
  $: characters = size === 'md' ? 6 : (size === 'sm' ? 4 : 6)
  let width = 0
  const handleResize = () => {
    width = window.innerWidth
  }
  handleResize()
</script>{#await address}{''}{:then $address}{#if ellipsis}{ellipsisAddress($address, characters, width < 768)}{:else}{$address}{/if}{/await}
<svelte:window on:resize={handleResize} />