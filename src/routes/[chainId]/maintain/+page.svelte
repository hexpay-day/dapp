<script lang="ts">
  import { fetchData } from "../../../stores/hex";
  import { chainId, address } from '../../../stores/web3'
  import { maintainable } from '../../../stores/stakes'
  import {
    Button,
  } from 'flowbite-svelte'
  import { Icon } from 'flowbite-svelte-icons'
  $: fetchData($chainId, $address)
</script>
<div class="flex max-w-5xl m-auto">
{#if !$maintainable.length}
<a href="/{$chainId}/start">
  <Button>New Stake&NonBreakingSpace;&NonBreakingSpace;<Icon name="plus-solid" size="sm" /></Button>
</a>
{/if}
</div>