<script lang="ts">
  import { navigating } from '$app/stores';
  import { loading } from '../stores/loading'
  import {
    Spinner,
  } from 'flowbite-svelte'
</script>

{#if $navigating || $loading > 0}
<Spinner size="6" />
{/if}
