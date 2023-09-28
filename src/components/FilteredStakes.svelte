<script lang="ts">
  import SvelteTable from 'svelte-table'
  import * as filteredStakesStore from '../stores/filtered-stakes'
  import EndSettings from './EndSettings.svelte'
  import { iconExpanded, iconExpand, renderIcon } from '../stores/filtered-stakes';
  $: filtered = filteredStakesStore.filtered
</script>

<div>
  <SvelteTable
    rows={$filtered}
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
      renderValue: (v) => `<pre>${v.owner}</pre>`,
      parseHTML: true,
    }]}>
      <svelte:fragment slot="expanded" let:row>
        <div class="pb-4 pt-2">
          <EndSettings stake={row} />
        </div>
      </svelte:fragment>
    </SvelteTable>
</div>
