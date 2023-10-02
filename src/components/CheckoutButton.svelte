<script lang="ts">
  import { ButtonGroup, Button, Spinner } from "flowbite-svelte";
  import { IconShoppingCartBolt } from "@tabler/icons-svelte";
  import { chainId, connected } from '../stores/web3'
  import { goto } from "$app/navigation";
	import _ from "lodash";
  export let action: ((() => Promise<void>) | (() => void)) = () => {}
  export let disabled = false
  const defaultText = 'Add to Sequence'
  export let text = defaultText
  export let requireConnected = false
  $: btnDisabled = disabled || (requireConnected && !$connected)
  let showSpinner = false
  const doAction = async () => {
    try {
      const doing = action()
      if (doing) {
        showSpinner = true
        await doing
      }
    } finally {
      showSpinner = false
    }
  }
</script>

<div class="flex flex-row">
  <div class="flex px-2 items-center">
    {#if showSpinner}
    <Spinner size="6" />
    {/if}
  </div>
  <ButtonGroup>
    <Button disabled={btnDisabled} class="h-[42px]" on:click={doAction}>{text || defaultText}</Button>
    <Button disabled={btnDisabled} on:click={async () => {
      await doAction()
      goto(`/${$chainId}/checkout`)
    }}><IconShoppingCartBolt /></Button>
  </ButtonGroup>
</div>