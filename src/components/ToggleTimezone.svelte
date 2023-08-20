<script lang="ts">
	import { Label, Toggle } from "flowbite-svelte";
  import { useISO } from '../stores/day'
</script>
<div class="flex flex-row">
  <Label class="flex flex-row items-center">
    <span class="pr-2 uppercase">{$useISO ? 'iso' : 'local'}</span>
    <Toggle bind:checked={$useISO} />
  </Label>
</div>
