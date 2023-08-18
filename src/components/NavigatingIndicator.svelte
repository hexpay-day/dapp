<script lang="ts">
  import { navigating } from '$app/stores';
  import {
    Spinner,
  } from 'flowbite-svelte'
</script>

{#if $navigating}
<Spinner size="6" />
{/if}
