<script lang="ts">
	import { ellipsisAddress } from "../stores/addresses";

  export let address!: string | Promise<string>
  export let ellipsis = false
  type Sizes = 'sm' | 'md'
  export let size: Sizes = 'md'
  $: characters = size === 'md' ? 6 : (size === 'sm' ? 4 : 6)
</script>

{#await address}{''}{:then $address}{#if ellipsis}{ellipsisAddress($address, characters)}{:else}{$address}{/if}{/await}
