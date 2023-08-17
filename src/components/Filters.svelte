<script lang="ts">
	import { ethers } from 'ethers';
  import {
    Helper,
    Toggle,
    Radio,
    Button,
    Dropdown,
    Label,
    ButtonGroup,
    InputAddon,
    Input,
    MultiSelect,
   } from 'flowbite-svelte';
  import { Icon } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
  import * as filtersStore from '../stores/filters'
	import _ from 'lodash';
  $: endable = filtersStore.endable
  $: pastStakes = filtersStore.pastStakes
  $: ownerValue = filtersStore.ownerValue
  $: isOwnerValueValid = filtersStore.isOwnerValueValid
  $: owners = filtersStore.owners
  $: stakeIdValue = filtersStore.stakeIdValue
  $: stakeIds = filtersStore.stakeIds
  $: isStakeIdValid = filtersStore.isStakeIdValid
</script>

<Toggle checked={$endable} on:change={filtersStore.endableChanged}>Endable</Toggle>
<Toggle checked={$pastStakes} on:change={filtersStore.pastChanged}>Past Stakes</Toggle>
<div class="grid grid-cols-2 gap-4">
  <div class="grid-child">
    <div class="mb-6">
      <Label for="owner-address" class="block mb-2">Owner Address</Label>
      <ButtonGroup class="w-full">
        <InputAddon>
          <Icon name="adress-book-solid" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </InputAddon>
        <Input
          color={$isOwnerValueValid ? 'green' : ($isOwnerValueValid === false ? 'red' : 'base')}
          id="owner-address"
          placeholder="0x369..."
          bind:value={$ownerValue}
          on:keyup={(e) => filtersStore.addAddressToOwner(e.code === 'Enter')} />
        <InputAddon>
          <Icon name="circle-plus-solid" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </InputAddon>
      </ButtonGroup>
    </div>
    <div class="space-x-2 mb-2">
      {#each $owners as owner}
      <span title="{owner.hash}">
        <Button on:click={() => filtersStore.removeOwner(owner)} size="xs">{owner.ens || `${owner.hash.slice(0, 8)}...${owner.hash.slice(-6)}`} &times;</Button>
      </span>
      {/each}
    </div>
  </div>
  <div class="grid-child">
    <div class="mb-6">
      <Label for="stake-id" class="block mb-2">Stake Id</Label>
      <ButtonGroup class="w-full">
        <InputAddon>
          <Icon name="adress-book-solid" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </InputAddon>
        <Input color={$isStakeIdValid ? 'green' : ($isStakeIdValid === false ? 'red' : 'base')} id="stake-id" placeholder="1234" bind:value={$stakeIdValue} on:keyup={(e) => filtersStore.addStakeIdToList(e.code === 'Enter')} />
        <InputAddon>
          <Icon name="circle-plus-solid" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </InputAddon>
      </ButtonGroup>
    </div>
    <div class="space-x-2 mb-2">
      {#each $stakeIds as stakeId}
      <Button on:click={() => filtersStore.removeStakeId(stakeId)} size="xs">{stakeId} &times;</Button>
      {/each}
    </div>
  </div>
</div>
