<script lang="ts">
  import {
    Timeline,
    TimelineItem,
  } from 'flowbite-svelte'
  import { TaskType, items } from '../../../stores/sequence'
	import { Icon } from 'flowbite-svelte-icons';
</script>

<div class="flex flex-col m-auto relative">
{#if !$items.length}
nothing to check out
{:else}
<Timeline order="vertical" class="sequence-timeline ml-3">
  {#each $items as item}
  {#if item.type === TaskType.start}
  <TimelineItem title="Start Stake">
    <svelte:fragment slot="icon">
      <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
        <Icon name="wand-magic-sparkles-outline" class="w-3 h-3 text-primary-600 dark:text-primary-400" />
      </span>
    </svelte:fragment>
  </TimelineItem>
  {/if}
  {/each}
  <li class="ml-6">
    <div class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900"></div>
    <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
      <Icon name="arrow-right-from-bracket-solid" class="w-3 h-3 text-primary-600 dark:text-primary-400" />
    </span>
    <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Finish</h3>
  </li>
</Timeline>
{/if}
</div>
