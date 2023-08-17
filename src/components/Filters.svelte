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
	import { provider } from '../stores/web3';
  const endableChanged = () => {}
  const pastChanged = () => {}

  type Address = {
    hash: string;
    ens: string | null | undefined;
  };
  const owners = writable<Address[]>([])
  // const options = [{
  //   radioText: 'Endable',
  //   helperText: 'Only show stakes that can be ended by the connected wallet',
  // }, {
  //   radioText: 'Upcoming',
  //   helperText: 'All stakes ending in the near future',
  // }, {
  //   radioText: 'All',
  //   helperText: 'All stakes ever created',
  // }]
  // $: isValid = null as null | boolean
  const isValid = writable<null | boolean>(null)
  $: ownerValue = ''
  const addAddressToOwner = async (e: KeyboardEvent) => {
    const p = provider()
    let hash = ownerValue
    let ens
    if (!ownerValue) {
      isValid.set(null)
      // isValid = null
      return
    }
    if (ownerValue.startsWith('0x') && ownerValue.length === 42) {
      // assume it is an address - not ens
      isValid.set(ethers.utils.isAddress(ownerValue))
      if ($isValid) {
        ens = await p.lookupAddress(ownerValue).catch(() => null)
      }
    } else {
      // look for suffixes
      if (ownerValue.endsWith('.pls') || ownerValue.endsWith('.eth')) {
        // lookup owner address
        hash = await p.resolveName(ownerValue).catch(() => ownerValue) || ownerValue
        ens = ownerValue
        isValid.set(ethers.utils.isAddress(hash))
      } else {
        isValid.set(false)
      }
    }
    if (!$isValid) {
      return
    }
    if (e.code !== 'Enter') {
      return
    }
    const address = {
      hash: ethers.utils.getAddress(hash),
      ens,
    }
    owners.update((list) => (
      list.concat(address)
    ))
    ownerValue = ''
  }
  const removeOwner = (owner: Address) => () => {
    owners.update((list) => (
      list.filter((item) => item.hash !== owner.hash)
    ))
  }
</script>

<Toggle checked on:change={endableChanged}>Endable</Toggle>
<Toggle on:change={pastChanged}>Past Stakes</Toggle>
<div class="mb-6">
  <Label for="owner-address" class="block mb-2">Owner Address</Label>
  <ButtonGroup class="w-full">
    <InputAddon>
      <Icon name="adress-book-solid" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </InputAddon>
    <Input color={$isValid ? 'green' : ($isValid === false ? 'red' : 'base')} id="owner-address" placeholder="0x369..." bind:value={ownerValue} on:keyup={addAddressToOwner} />
    <InputAddon>
      <Icon name="circle-plus-solid" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
    </InputAddon>
  </ButtonGroup>
</div>
{#each $owners as owner}
  <Button on:click={removeOwner(owner)} size="xs">{owner.ens || `${owner.hash.slice(0, 8)}...${owner.hash.slice(-6)}`} &times;</Button>
{/each}
<!--
<Button>Scope<Icon name="chevron-down-solid" class="w-3 h-3 ml-2 text-white dark:text-white" /></Button>
<Dropdown class="w-60 text-sm">
  {#each options as option}
  <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
    <Radio name="scope">{option.radioText}</Radio>
    <Helper class="pl-6">{option.helperText}</Helper>
  </li>
  {/each}
</Dropdown> -->
