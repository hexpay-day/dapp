<script lang="ts">
  import * as chainIdStore from '../stores/chain-id'
  import { page } from '$app/stores';

  $: chainId = chainIdStore.chainId
</script>

<div class="container">
  <a href="/{$chainId}/stakes/{$page.data.day}">Current Day ({$page.data.day})</a>
</div>
