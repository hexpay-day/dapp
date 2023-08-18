<script lang="ts">
  import {
    Toggle,
    Button,
    Label,
    ButtonGroup,
    InputAddon,
    Input,
  } from 'flowbite-svelte';
  import { DateInput } from 'date-picker-svelte'
  import { Icon } from 'flowbite-svelte-icons';
  import * as filtersStore from '../stores/filters'
	import _ from 'lodash';
  import { page } from '$app/stores';
	import { elipsisAddress } from '../stores/addresses';
	import { goto } from '$app/navigation';
	import * as web3Store from '../stores/web3';
	import { ethers } from 'ethers';
  $: address = web3Store.address
  $: endable = filtersStore.endable
  $: optimizable = filtersStore.optimizable
  $: ownerValue = filtersStore.ownerValue
  $: isOwnerValueValid = filtersStore.isOwnerValueValid
  $: owners = filtersStore.owners
  $: stakeIdValue = filtersStore.stakeIdValue
  $: stakeIds = filtersStore.stakeIds
  $: isStakeIdValid = filtersStore.isStakeIdValid

  $: startDate = filtersStore.startDate
  $: untilDate = filtersStore.untilDate
  $: offsetDays = filtersStore.offsetDays
  $: offsetDate = new Date(+$startDate + ($offsetDays * filtersStore.DAY))
  const {
    today,
    endableChanged,
    onlyOptimizableChanged,
    dateToDay,
    launchDate,
    maxDate,
  } = filtersStore
  const logEndableChanged = (evt: Event) => endableChanged((evt.target as any).checked)
  const logOptimizableChanged = (evt: Event) => onlyOptimizableChanged((evt.target as any).checked)
  $: baseUrl = `/${$page.data.chainId}/${dateToDay(today())}`
</script>

<div class="flex gap-4 my-2">
  <Toggle checked={$optimizable} on:change={logOptimizableChanged}>Only Optimizable</Toggle>
  <Toggle checked={$endable} on:change={logEndableChanged}>Only Endable</Toggle>
  <DateInput
    bind:value={$startDate}
    on:select={() => {
      const day = dateToDay($startDate)
      goto(`/${$page.data.chainId}/${day}/${$offsetDays}`, {
        keepFocus: true,
        replaceState: true,
        noScroll: true,
        invalidateAll: true,
      })
    }}
    max={maxDate}
    min={launchDate}
    format="yyyy-MM-dd"
    class="flex rounded"
    browseWithoutSelecting
    closeOnSelection />
  <a href="{baseUrl}/{$page.data.count}">
    <Button
      size="md"
      disabled={+($startDate) === +today() && +($untilDate) === +today()}
      on:click={() => {
        filtersStore.startDate.set(today())
        filtersStore.offsetDays.set(filtersStore.defaultOffsetDays)
        goto(`/${$page.data.chainId}/${dateToDay(today())}/${filtersStore.defaultOffsetDays}`, {
          keepFocus: true,
          replaceState: true,
          noScroll: true,
          invalidateAll: true,
        })
      }}>Reset</Button>
  </a>
  <DateInput
    bind:value={offsetDate}
    on:select={() => {
      const offset = (+offsetDate - +$startDate) / filtersStore.DAY
      filtersStore.offsetDays.set(offset)
      const day = dateToDay($startDate)
      goto(`/${$page.data.chainId}/${day}/${offset}`, {
        keepFocus: true,
        replaceState: true,
        noScroll: true,
        invalidateAll: true,
      })
    }}
    max={new Date(Math.min(+filtersStore.maxDate, +$startDate + (filtersStore.maxOffsetDays * filtersStore.DAY)))}
    min={$startDate}
    format="yyyy-MM-dd"
    class="flex rounded"
    browseWithoutSelecting
    closeOnSelection />
  <Button
    disabled={$address !== ethers.constants.AddressZero && !!$owners.find((owner) => owner.hash === $address)}
    on:click={() => filtersStore.addAddressToOwnerRaw($address, true)}>Show Own</Button>
</div>
<div class="grid grid-cols-2 gap-4 my-2">
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
        <Button on:click={() => filtersStore.removeOwner(owner)} size="xs">{owner.ens || elipsisAddress(owner.hash)} &times;</Button>
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
        <Input
          color={$isStakeIdValid ? 'green' : ($isStakeIdValid === false ? 'red' : 'base')}
          id="stake-id"
          placeholder="1234"
          bind:value={$stakeIdValue}
          on:keyup={(e) => filtersStore.addStakeIdToList(e.code === 'Enter')} />
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
