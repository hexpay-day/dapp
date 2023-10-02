<script lang=ts>
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from 'flowbite-svelte';
  import { renderIcon } from "../stores/filtered-stakes";
  import * as web3Store from "../stores/web3";
  import * as addresses from "../stores/addresses";
  import type * as types from '../types'
  import { slide } from 'svelte/transition';
	import Address from './Address.svelte';
	import HexPayDayIcon from './icons/HexPayDay.svelte';
	import _ from 'lodash';
	import { queryParameters, ssp } from 'sveltekit-search-params';
  import { store as qStore } from '../stores/qs'
  export let title = ''
  export let rows!: types.Stake[]
  let openRow!: types.Stake | null
  const store = queryParameters({
    stakeId: ssp.number(),
  })
  const getIndexOf = (stakeId: number) => _.findIndex(rows, (row) => row.stakeId === stakeId)
  // let details
  let cachedRows = rows
  $: if (!_.isEqual(cachedRows, rows)) {
    openRow = null
  }
  qStore.subscribe(({ stakeId }) => {
    if (stakeId && $store.stakeId !== stakeId) {
      store.update(($store) => ({
        ...$store,
        stakeId,
      }))
    }
  })
  $: openRow = rows[getIndexOf($store.stakeId)]
  const toggleRow = (i: number) => {
    const stake = rows[i]
    if (stake) qStore.update(($store) => ({
      ...$store,
      stakeId: stake.stakeId,
    }))
  }
  const tdClass = "px-3 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white"
</script>

<div class="flex flex-col my-4">
  {#if title}
  <h1 class="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-4xl dark:text-white">{title}</h1>
  {/if}
  <div class="shadow-md">
    <Table divClass={'relative'} hoverable>
      <TableHead>
        <TableHeadCell padding="px-3 py-4">Stake Id</TableHeadCell>
        <TableHeadCell padding="px-3 py-4">End Day</TableHeadCell>
        <TableHeadCell padding="px-3 py-4">Owner</TableHeadCell>
        <TableHeadCell padding="px-3 py-4">Custodian</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#each rows as row, i}
          <TableBodyRow on:click={() => toggleRow(i)}>
            <TableBodyCell {tdClass}>
              <span class="flex">
                {@html renderIcon(row)}
                {web3Store.numberWithCommas(row.stakeId.toString())}
                {#if row.owner === addresses.ExistingStakeManager || row.custodian === addresses.StakeManager}
                <span class="w-6 flex justify-end">
                  <HexPayDayIcon />
                </span>
                {/if}
              </span>
            </TableBodyCell>
            <TableBodyCell {tdClass}><span class="flex">{row.endDay}</span></TableBodyCell>
            <TableBodyCell {tdClass}><span class="flex"><Address address={row.owner} /></span></TableBodyCell>
            <TableBodyCell {tdClass}><span class="flex"><Address address={row.custodian} /></span></TableBodyCell>
          </TableBodyRow>
          {#if openRow === row}
          <TableBodyRow>
            <TableBodyCell colspan="4" class="p-0">
              <div class="px-3 py-4" transition:slide={{ duration: 300, axis: 'y' }}>
                <slot {row} />
              </div>
            </TableBodyCell>
          </TableBodyRow>
          {/if}
        {/each}
      </TableBody>
    </Table>
  </div>
</div>
