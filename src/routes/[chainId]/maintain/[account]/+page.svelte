<script lang="ts">
  import { fetchData } from "../../../../stores/hex";
  import { chainId, address } from '../../../../stores/web3'
  import { page } from '$app/stores'
  import {
    Button,
  } from 'flowbite-svelte'
  import { IconPlus } from '@tabler/icons-svelte'
	import _ from "lodash";
	import SvelteTable from "svelte-table";
	import type { Stake } from "../../../../types";
  import { iconExpand, iconExpanded, renderIcon } from "../../../../stores/filtered-stakes";
	import MaintainSettings from "../../../../components/MaintainSettings.svelte";
	import { ellipsisAddress } from "../../../../stores/addresses";
  $: fetchData($chainId || 0, $address)
  // $: maintainable = _.sortBy(toStake($page.data.maintainable || []), 'endDay')
  $: maintainable = $page.data.maintainable as Stake[]
  // $: maintainable = $page.data.maintainable
  // $: console.log(maintainable)
	// import { toStake } from "../../../../stores/queries";
</script>
<div class="flex max-w-5xl m-auto">
{#if !maintainable.length}
<a href="/{$chainId || 0}/start">
  <Button>New Stake&NonBreakingSpace;&NonBreakingSpace;<IconPlus /></Button>
</a>
{/if}
  <SvelteTable
    rows={maintainable}
    expandSingle
    showExpandIcon
    classNameTbody="text-monospace"
    rowKey="stakeId"
    {iconExpanded}
    {iconExpand}
    columns={[{
      key: 'stakeId',
      title: 'Stake Id',
      value: (v) => v.stakeId.toString(),
      headerClass: 'text-left',
      renderValue: (v) => `<span class="flex">${renderIcon(v)}<pre class="flex">${v.stakeId}</pre></span>`,
      parseHTML: true,
    }, {
      key: 'endDay',
      title: 'End Day',
      headerClass: 'text-left',
      renderValue: (v) => `<pre>${v.endDay}</pre>`,
      parseHTML: true,
    }, {
      key: 'owner',
      title: 'Owner',
      // who has control over the stake
      headerClass: 'text-left',
      renderValue: (v) => {
        const custodianIsOwner = v.custodian === v.owner
        return `<pre>${custodianIsOwner ? v.owner : ellipsisAddress(v.owner, 8)}${v.custodian === v.owner ? '' : ` / ${v.custodian}`}</pre>`
      },
      parseHTML: true,
    }]}>
    <svelte:fragment slot="expanded" let:row>
      <div class="pb-4 pt-2">
        <MaintainSettings stake={row} />
      </div>
    </svelte:fragment>
  </SvelteTable>
</div>
