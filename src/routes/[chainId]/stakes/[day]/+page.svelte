<script lang="ts">
  import _ from 'lodash'
  // import * as stakeStores from '../../../../stores/stakes'
  import * as dayStores from '../../../../stores/day'
	import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { Stake } from 'knex/types/tables'
  import { AccordionItem, Accordion, Label } from 'flowbite-svelte'
  import AccordionHeader from '../../../../components/AccordionHeader.svelte'

  $: stakes = $page.data.stakes as Stake[]
  $: unoptimizable = stakes.filter((stake) => !stake.isHsi)
  $: optimizable = stakes.filter((stake) => stake.isHsi)

  onMount(() => {
    let id!: NodeJS.Timeout
    const collectData = async () => {
      const ms = _.now()
      const MIN = 1_000 * 60
      const consumed = ms % MIN
      const awaiting = MIN - consumed
      id = setTimeout(collectData, awaiting)
    }
    collectData()
    return () => {
      clearTimeout(id)
    }
  })
</script>
<div class="container m-auto">
  <div class="flex dark:text-white">
    <a class="px-2" href="{`${parseInt($page.params.day) - 1}`}">&lt;&nbsp;</a>
    <h1 class="text-xl">Day: {$page.params.day} - {dayStores.dayToIso(BigInt($page.params.day))}</h1>
    <a class="px-2" href="{`${parseInt($page.params.day) + 1}`}">&nbsp;&gt;</a>
  </div>
  <Accordion>
    <AccordionItem>
      <AccordionHeader slot="header" length={0}>Optimized</AccordionHeader>
      <ul></ul>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader slot="header" length={0}>Endable</AccordionHeader>
      <ul></ul>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader slot="header" length={optimizable.length}>Optimizable</AccordionHeader>
      <ul>
        {#each optimizable as item}
        <li>
          <pre class="flex">
            <div class="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                value=""
                disabled
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label
                for="checked-checkbox"
                class="ml-2 text-sm font-medium text-gray-900 flex">
                <span class="flex dark:text-gray-300"><Label color="gray">#{_.padStart(item.stakeId, 7, ' ')}</Label> staked <Label color="red">{_.padStart(item.stakedDays.toString(), 4, ' ')}</Label> days {#if item.isHsi}<img width="20" height="20" alt="a white dodecahedron on a blue background" src="/hedron.png" />{:else}{/if}<a href="https://twitter.com/home?status={encodeURIComponent('Looks like someone is about to end a #hex stake all by their lonesome. Try adding it to a pool to end it with others and reduce costs at the same time!')}">Tweet</a></span>
              </label>
            </div>
          </pre>
        </li>
        {/each}
      </ul>
    </AccordionItem>
    <AccordionItem>
      <AccordionHeader slot="header" length={unoptimizable.length}>Unoptimizable</AccordionHeader>
      <ul>
        {#each unoptimizable as item}
        <li>
          <pre class="flex">
            <div class="flex items-center">
              <input
                id="checked-checkbox"
                type="checkbox"
                value=""
                disabled
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label
                for="checked-checkbox"
                class="ml-2 text-sm font-medium text-gray-900 flex">
                <span class="flex dark:text-gray-300"><Label color="gray">#{_.padStart(item.stakeId, 7, ' ')}</Label> staked <Label color="red">{_.padStart(item.stakedDays.toString(), 4, ' ')}</Label> days {item.stakedDays > 100 ? '💀' : ''}</span>
              </label>
            </div>
          </pre>
        </li>
        {/each}
      </ul>
    </AccordionItem>
  </Accordion>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
