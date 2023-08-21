<script lang="ts">
	import { Label, Toggle } from "flowbite-svelte";
  import { useISO, timezoneLabel } from '../stores/day'
</script>
<div class="flex flex-row">
  <Label class="flex flex-row items-center">
    <Toggle bind:checked={$useISO} />
    <span class="pr-3 uppercase text-left min-w-[60px]">{$timezoneLabel}</span>
  </Label>
</div>
