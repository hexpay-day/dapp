<script lang="ts">
  import { ButtonGroup, Button } from "flowbite-svelte";
  import { IconShoppingCartBolt } from "@tabler/icons-svelte";
  import { goto } from "$app/navigation";
	import _ from "lodash";
  export let action = async () => {}
  export let disabled = false
  export let pathReverse = 0
  const range = _.range(0, pathReverse)
  const prefix = range.map(() => '../').join('') || './'
</script>

<ButtonGroup>
  <Button {disabled} class="h-[42px]" on:click={async () => {
    await action()
  }}>Add to Sequence</Button>
  <Button {disabled} on:click={async () => {
    await action()
    goto(`${prefix}checkout`)
  }}><IconShoppingCartBolt /></Button>
</ButtonGroup>
