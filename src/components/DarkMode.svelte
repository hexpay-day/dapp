<script lang="ts">
  import {
    DarkMode,
  } from 'flowbite-svelte'
  import { IconSun, IconMoon } from '@tabler/icons-svelte'
</script>

<DarkMode class="text-lg bg-gray-200 dark:bg-gray-600 h-[42px] w-[44px] items-center mr-2">
  <svelte:fragment slot="lightIcon">
    <IconSun class="m-auto" />
  </svelte:fragment>
  <svelte:fragment slot="darkIcon">
    <IconMoon class="m-auto" />
  </svelte:fragment>
</DarkMode>