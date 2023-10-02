<script lang="ts">
  import { TimelineTypes } from '../types'
	import {
    IconBuildingBank,
    IconCoin,
    IconFlame,
    IconHexagon,
    IconPencil,
    IconPray,
  } from "@tabler/icons-svelte";
  export let type = 'none'
</script>

{#if type === 'none'}&nbsp;
{:else if type === TimelineTypes.DEPOSIT_HSI}
<IconBuildingBank />&nbsp;{TimelineTypes.DEPOSIT_HSI}
{:else if type === TimelineTypes.WITHDRAW_HSI}
<IconBuildingBank />&nbsp;{TimelineTypes.WITHDRAW_HSI}
{:else if type === TimelineTypes.UPDATE}
<IconPencil />&nbsp;{TimelineTypes.UPDATE}
{:else if type === TimelineTypes.GOOD_ACCOUNT}
<IconPray />&nbsp;{TimelineTypes.GOOD_ACCOUNT}
{:else if type === TimelineTypes.END}
<IconHexagon />&nbsp;{TimelineTypes.END}
{:else if type === TimelineTypes.RESTART_STAKE}
<IconFlame />&nbsp;{TimelineTypes.RESTART_STAKE}
{:else if type === TimelineTypes.TOKENIZE_HSI}
<IconCoin />&nbsp;{TimelineTypes.TOKENIZE_HSI}
{/if}
