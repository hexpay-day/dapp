<script lang="ts">

  import SvelteTable from 'svelte-table'
  import * as filteredStakesStore from '../stores/filtered-stakes'
  import * as addressesStore from '../stores/addresses'
  import EndSettings from './EndSettings.svelte'
  import {
    IconChevronDown,
    IconChevronUp,
  } from '@tabler/icons-svelte'
	import { renderHedronIcon } from '../stores/image';
	// import { IconChevronUp } from '@tabler/icons-svelte';

  $: filtered = filteredStakesStore.filtered

  const renderIcon = (v: filteredStakesStore.Stake) => {
    return v.isHedron ? renderHedronIcon(v.custodian) : (
      addressesStore.perpetuals.has(v.owner) ? `<span class="w-6 inline-block"><img width="20" height="20" alt="a gold letter m on a blue background with faded hexagons and a gold border" src="/maximus.png" title="${v.custodian}" /></span>` : '<span class="w-6 inline-block"></span>'
    )
  }
  const sizeMultiplier = 1.4
  const iconExpanded = `<span class="flex justify-center items-center ml-auto w-6 h-6"><svg viewBox="0 0 ${10} ${7}" height="${7 * sizeMultiplier}" width="${10 * sizeMultiplier}">${IconChevronDown}</svg></span>`
  const iconExpand = `<span class="flex justify-center items-center ml-auto w-6 h-6"><svg viewBox="0 0 ${10} ${7}" height="${7 * sizeMultiplier}" width="${10 * sizeMultiplier}">${IconChevronUp}</svg></span>`
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
