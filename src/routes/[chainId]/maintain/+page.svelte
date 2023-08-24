<script lang="ts">
  import { fetchData } from "../../../stores/hex";
  import { chainId, address } from '../../../stores/web3'
  import { maintainable } from '../../../stores/stakes'
  import {
    Button,
  } from 'flowbite-svelte'
  import { IconPlus } from '@tabler/icons-svelte'
  $: fetchData($chainId, $address)
</script>
<div class="flex max-w-5xl m-auto">
{#if !$maintainable.length}
<a href="/{$chainId}/start">
  <Button>New Stake&NonBreakingSpace;&NonBreakingSpace;<IconPlus /></Button>
</a>
{/if}
</div>