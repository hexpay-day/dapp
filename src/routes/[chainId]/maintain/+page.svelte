<script lang="ts">
  import { chainId, connected, address } from '../../../stores/web3'
  import { options } from '../../../stores/contracts'
  import {
    Button,
  } from 'flowbite-svelte'
  import { IconChevronsRight, IconPlus } from '@tabler/icons-svelte'
  import { page } from '$app/stores'
	import StakeTable from '../../../components/StakeTable.svelte';
	import MaintainSettings from '../../../components/MaintainSettings.svelte';
	import _ from 'lodash';
</script>
<div class="flex flex-col max-w-5xl w-full m-auto">
  <div class="flex justify-between">
    <a href="/{$chainId || 0}/start">
      <Button>New Stake<span class="inline-block mx-1"><IconPlus /></span></Button>
    </a>
    {#if $connected}
    <a href="/{$chainId || 0}/maintain/{$address}">
      <Button>Show Connected<span class="inline-block mx-1"><IconChevronsRight /></span></Button>
    </a>
    {/if}
  </div>
  <div class="flex flex-col w-full">
    <StakeTable title="Perpetuals" rows={_.sortBy($page.data.perpetuals, ['endDay', 'stakeId'])} let:row>
      <MaintainSettings stake={row} options={options.perpetuals} />
    </StakeTable>
  </div>
</div>
