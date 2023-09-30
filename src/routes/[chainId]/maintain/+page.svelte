<script lang="ts">
  import { chainId, address } from '../../../stores/web3'
  import {
    Button,
  } from 'flowbite-svelte'
  import { IconPlus } from '@tabler/icons-svelte'
	import { goto } from "$app/navigation";
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
  let mounted = false
  onMount(() => { mounted = true })
  $: $chainId && ethers.utils.isAddress($address) && mounted && goto(`/${$chainId}/maintain/${$address}`, {
    replaceState: true,
  })
</script>
<div class="flex max-w-5xl m-auto">
<a href="/{$chainId || 0}/start">
  <Button>New Stake&NonBreakingSpace;&NonBreakingSpace;<IconPlus /></Button>
</a>
</div>
