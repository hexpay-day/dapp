<script lang="ts">
  import {
    IconThumbUp,
    IconFlame,
    IconOutbound,
    IconChevronsRight,
  } from '@tabler/icons-svelte'
  export let type = ''
  let className = 'w-4 h-4 text-primary-600 dark:text-primary-400'
  export { className as class }
</script>
<span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
  {#if type === 'thumbup'}
  <IconThumbUp class={className} />
  {:else if type === 'flame'}
  <IconFlame class={className} />
  {:else if type === 'outbound'}
  <IconOutbound class={className} />
  {:else if type === 'chevronsright'}
  <IconChevronsRight class={className} />
  {/if}
</span>
