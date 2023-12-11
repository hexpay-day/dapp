<script lang="ts">
  import { Button, Dropdown, Label, Toggle, Helper } from "flowbite-svelte";
  import {
    othersCanEnd,
    canMintHedronAtAnyTime,
    shouldMintHedronAtEnd,
    shouldMintCommunisAtEnd,
    contractCustodyTokens,
    allowStakeToBeTransfered,
    fundFromWallet,
    startStakeFromUnattributed,
  } from "../../stores/settings";
</script>

<Button class="h-[42px]">Abilities</Button>
<Dropdown class="w-80" placement="bottom-start">
  <Label class="p-2">
    <Toggle bind:checked={$othersCanEnd}>Others Can End</Toggle>
    <Helper class="pl-14">Anyone can end this stake after the full term is served.</Helper>
  </Label>
  <Label class="p-2">
    <Toggle bind:checked={$canMintHedronAtAnyTime}>Can Mint Hedron at any time</Toggle>
    <Helper class="pl-14">Can mint $HEDRON for owner of stake. Custody determined by option below.</Helper>
  </Label>
  <Label class="p-2">
    <Toggle bind:checked={$shouldMintHedronAtEnd}>Should Mint Hedron at End</Toggle>
    <Helper class="pl-14">Mint $HDRN for owner of stake when stake is being ended.</Helper>
  </Label>
  <Label class="p-2">
    <Toggle bind:checked={$shouldMintCommunisAtEnd}>Should Mint Communis at End</Toggle>
    <Helper class="pl-14">Mint $COMM for owner of stake when stake is being ended.</Helper>
  </Label>
  <Label class="p-2">
    <Toggle bind:checked={$contractCustodyTokens}>Custody Tokens</Toggle>
    <Helper class="pl-14">Contract should retain custodian of tokens until owner collects them.</Helper>
  </Label>
  <Label class="p-2">
    <Toggle bind:checked={$allowStakeToBeTransfered}>Allow Stake to be Transferred</Toggle>
    <Helper class="pl-14">Allow the owner of the stake to change. Can only be turned off after stake start.</Helper>
  </Label>
  {#if !$fundFromWallet}
  <Label class="p-2">
    <Toggle bind:checked={$startStakeFromUnattributed}>Start Stake from Unattributed</Toggle>
    <Helper class="pl-14">Use unattributed tokens already deposited in contract to start stake.</Helper>
  </Label>
  {/if}
</Dropdown>
