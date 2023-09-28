<script lang=ts>
  import { Label } from "flowbite-svelte";
  import DecimalInput from '../DecimalInput.svelte'
  import { copyIterations } from "../../stores/settings";
	import _ from "lodash";
</script>

<div class="flex flex-col col-span-1">
  <Label for="restart-count">Copy Settings on Restart</Label>
  <DecimalInput
    decimals={0}
    id="restart-count"
    uint
    defaultText={`${$copyIterations}`}
    on:update={(e) => { copyIterations.set(e.detail.value) }}
    infiniteAt={255n}
    placeholder="0" />
</div>