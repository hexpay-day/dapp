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
  import { IconAddressBook, IconCirclePlus } from '@tabler/icons-svelte';
  import * as filtersStore from '../stores/filters'
	import _ from 'lodash';
  import { page } from '$app/stores';
	import { elipsisAddress } from '../stores/addresses';
	import { goto } from '$app/navigation';
	import * as web3Store from '../stores/web3';
	import * as dayStore from '../stores/day';
	import * as filteredStakesStore from '../stores/filtered-stakes';
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

  $: startDate = filteredStakesStore.startDate
  $: untilDate = filteredStakesStore.untilDate
  $: offsetDays = filteredStakesStore.offsetDays
  $: offsetDate = new Date(+$startDate + ($offsetDays * dayStore.DAY))
  const {
    defaultOffsetDays,
    maxOffsetDays,
  } = filteredStakesStore
  const {
    today,
    dateToDay,
    launchDate,
    maxDateISO,
    DAY,
  } = dayStore
  const {
    endableChanged,
    onlyOptimizableChanged,
  } = filtersStore
  const logEndableChanged = (evt: Event) => endableChanged((evt.target as any).checked)
  const logOptimizableChanged = (evt: Event) => onlyOptimizableChanged((evt.target as any).checked)
  type Params = {
    chainId: number;
    day: number;
    offset: number;
  }
  const endUrl = (params: Params) => {
    return `/${params.chainId}/end/${params.day}/${params.offset}`
  }
</script>

<div class="flex gap-4 my-2 lg:flex-row flex-col">
  <div class="flex gap-4">
    <Toggle checked={$optimizable} on:change={logOptimizableChanged}>Only Optimizable</Toggle>
    <Toggle checked={$endable} on:change={logEndableChanged}>Only Endable</Toggle>
  </div>
  <div class="flex gap-4">
    <DateInput
      bind:value={$startDate}
      on:select={() => {
        const day = dateToDay($startDate)
        const url = endUrl({
          chainId: $page.data.chainId,
          day,
          offset: $offsetDays,
        })
        goto(url, {
          keepFocus: true,
          replaceState: true,
          noScroll: true,
          invalidateAll: true,
        })
      }}
      max={$maxDateISO}
      min={launchDate}
      format="yyyy-MM-dd"
      class="flex rounded"
      browseWithoutSelecting
      closeOnSelection />
    <a href="{endUrl({
      chainId: $page.data.chainId,
      day: dateToDay(today()),
      offset: $page.data.count,
    })}">
      <Button
        size="md"
        disabled={+($startDate) === +today() && +($untilDate) === +today()}
        on:click={() => {
          startDate.set(today())
          offsetDays.set(defaultOffsetDays)
          const url = endUrl({
            chainId: $page.data.chainId,
            day: dateToDay(today()),
            offset: defaultOffsetDays,
          })
          goto(url, {
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
        const offset = (+offsetDate - +$startDate) / DAY
        offsetDays.set(offset)
        const day = dateToDay($startDate)
        const url = endUrl({
          chainId: $page.data.chainId,
          day,
          offset,
        })
        goto(url, {
          keepFocus: true,
          replaceState: true,
          noScroll: true,
          invalidateAll: true,
        })
      }}
      max={new Date(Math.min(+$maxDateISO, +$startDate + (maxOffsetDays * DAY)))}
      min={$startDate}
      format="yyyy-MM-dd"
      class="flex rounded"
      browseWithoutSelecting
      closeOnSelection />
    <Button
      disabled={$address === ethers.constants.AddressZero || !!$owners.find((owner) => owner.hash === $address)}
      on:click={() => filtersStore.addAddressToOwnerRaw($address, true)}>Show Own</Button>
  </div>
</div>
<div class="grid grid-cols-2 gap-4 my-2">
  <div class="grid-child">
    <div class="mb-6">
      <Label for="owner-address" class="block mb-2">Owner Address</Label>
      <ButtonGroup class="w-full">
        <InputAddon>
          <IconAddressBook class="w-4 h-4 text-gray-500 dark:text-gray-400" /> <!-- name="adress-book-solid"-->
        </InputAddon>
        <Input
          color={$isOwnerValueValid ? 'green' : ($isOwnerValueValid === false ? 'red' : 'base')}
          id="owner-address"
          placeholder="0x369..."
          bind:value={$ownerValue}
          on:keyup={(e) => filtersStore.addAddressToOwner(e.code === 'Enter')} />
        <InputAddon>
          <IconCirclePlus class="w-4 h-4 text-gray-500 dark:text-gray-400" /> <!-- name="circle-plus-solid" -->
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
          <IconAddressBook class="w-4 h-4 text-gray-500 dark:text-gray-400" /> <!-- name="adress-book-solid"-->
        </InputAddon>
        <Input
          color={$isStakeIdValid ? 'green' : ($isStakeIdValid === false ? 'red' : 'base')}
          id="stake-id"
          placeholder="1234"
          bind:value={$stakeIdValue}
          on:keyup={(e) => filtersStore.addStakeIdToList(e.code === 'Enter')} />
        <InputAddon>
          <IconCirclePlus class="w-4 h-4 text-gray-500 dark:text-gray-400" /> <!-- name="circle-plus-solid"-->
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
