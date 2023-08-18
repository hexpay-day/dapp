<script lang="ts">

  import SvelteTable from 'svelte-table'
  import * as filteredStakesStore from '../stores/filtered-stakes'
  import * as addressesStore from '../stores/addresses'
  import EndSettings from './EndSettings.svelte'

  $: filtered = filteredStakesStore.filtered

  const renderHedronIcon = (v: filteredStakesStore.Stake) => {
    return v.isHedron ? `<span class="w-6 inline-block"><img width="20" height="20" alt="a white dodecahedron on a blue background" src="/hedron.png" title="${v.custodian}" /></span>` : (
      addressesStore.perpetuals.has(v.owner) ? `<span class="w-6 inline-block"><img width="20" height="20" alt="a gold letter m on a blue background with faded hexagons and a gold border" src="/maximus.png" title="${v.custodian}" /></span>` : '<span class="w-6 inline-block"></span>'
    )
  }
</script>

<div>
  <SvelteTable
    rows={$filtered}
    expandSingle
    showExpandIcon
    classNameTbody="text-monospace"
    rowKey="stakeId"
    columns={[{
      key: 'stakeId',
      title: 'Stake Id',
      value: (v) => v.stakeId.toString(),
      headerClass: 'text-left',
      renderValue: (v) => `<span class="flex">${renderHedronIcon(v)}<pre class="flex">${v.stakeId}</pre></span>`,
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
        <EndSettings stake={row} />
      </svelte:fragment>
    </SvelteTable>
</div>
