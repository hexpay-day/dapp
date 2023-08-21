<script lang="ts">
  import Filters from '../../../../../components/Filters.svelte'
  import FilteredStakes from '../../../../../components/FilteredStakes.svelte'
  import * as filteredStakeStore from '../../../../../stores/filtered-stakes'
  import { dayToDate } from '../../../../../stores/day'

  import { page } from '$app/stores';

  $: filteredStakeStore.startDate.set(dayToDate(+$page.data.day))
  $: filteredStakeStore.offsetDays.set($page.data.count)
  $: filteredStakeStore.all.set($page.data.stakes)
</script>

<div class="flex max-w-5xl flex-col m-auto">
  <Filters />
  <FilteredStakes />
</div>