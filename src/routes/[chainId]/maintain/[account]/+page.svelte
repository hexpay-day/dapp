<script lang="ts">
  import { page } from '$app/stores'
  import {
    Button,
  } from 'flowbite-svelte'
  import { IconPlus } from '@tabler/icons-svelte'
	import _ from "lodash";
  import { chainId } from '../../../../stores/web3'
  import { options } from '../../../../stores/contracts'
	import type * as types from "../../../../types";
	import MaintainSettings from "../../../../components/MaintainSettings.svelte";
	import StakeTable from "../../../../components/StakeTable.svelte";
  $: maintainable = $page.data.maintainable as types.Stake[]
  $: perpetuals = $page.data.perpetuals as types.Stake[]
  $: all = perpetuals.concat(maintainable)
</script>
<div class="flex flex-col max-w-5xl w-full m-auto">
  {#if !all.length}
  <a href="/{$chainId || 0}/start">
    <Button>New Stake&NonBreakingSpace;&NonBreakingSpace;<IconPlus /></Button>
  </a>
  {/if}
  <div class="flex flex-col w-full">
    <StakeTable title="Owned Stakes" rows={_.sortBy(maintainable, ['endDay', 'stakeId'])} let:row>
      <MaintainSettings stake={row} options={options.hsi} />
    </StakeTable>
    <StakeTable title="Perpetuals" rows={_.sortBy(perpetuals, ['endDay', 'stakeId'])} let:row>
      <MaintainSettings stake={row} options={options.perpetuals} />
    </StakeTable>
  </div>
</div>
