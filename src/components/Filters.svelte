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
  import {
    IconPlus,
    IconAddressBook,
  } from '@tabler/icons-svelte';
  import * as filtersStore from '../stores/filters'
	import _ from 'lodash';
  import { page } from '$app/stores';
  import Address from './Address.svelte';
	import { goto } from '$app/navigation';
	import * as web3Store from '../stores/web3';
	import * as dayStore from '../stores/day';
	import * as filteredStakesStore from '../stores/filtered-stakes';
	import { ethers } from 'ethers';
	import { IconX } from '@tabler/icons-svelte';
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
    console.log(params)
    return `/${params.chainId}/end/${params.day}/${params.offset}`
  }
  export let day = '0'
  const submitDayUpdate = () => {
    const url = endUrl({
      chainId: $page.data.chainId,
      day: +day,
      offset: $page.data.count,
    })
    goto(url, {
      keepFocus: true,
      replaceState: false,
      noScroll: true,
      invalidateAll: true,
    })
  }
</script>

<div class="flex gap-4 my-2 flex-col">
  <div class="flex gap-4">
    <Toggle checked={$optimizable} on:change={logOptimizableChanged}>Only Optimizable</Toggle>
    <Toggle checked={$endable} on:change={logEndableChanged}>Only Endable</Toggle>
  </div>
  <div class="flex gap-4 flex-row">
    <div class="flex gap-4">
      <ButtonGroup>
        <Button class="flex-shrink-0" color=primary on:click={submitDayUpdate}>Go To Day</Button>
        <Input class="flex-shrink text-center w-[100px]" bind:value={day} on:keypress={(e) => {
          if (e.code === 'Enter') submitDayUpdate()
        }} />
        <!-- <InputAddon>Day(s)</InputAddon> -->
      </ButtonGroup>
    </div>
    <div class="flex gap-4">
      <ButtonGroup>
        <div role="group" class="flex-grow" on:keypress={() => {}} on:click|preventDefault={(e) => {}}>
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
            class="flex flex-grow h-[2.625rem] ml-[-1px] start-time-filters-cal-container second-class text-center"
            browseWithoutSelecting
            closeOnSelection />
        </div>
        <Button
          size="md"
          disabled={+($startDate) === +today() && +($untilDate) === +today()}
          color=primary
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
        <div role="group" class="flex-grow" on:keypress={() => {}} on:click|preventDefault={(e) => {}}>
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
            class="flex flex-grow h-[2.625rem] ml-[-1px] end-time-filters-cal-container second-class text-center"
            browseWithoutSelecting
            closeOnSelection />
        </div>
      </ButtonGroup>
    </div>
    <Button
      disabled={$address === ethers.ZeroAddress || !!$owners.find((owner) => owner.hash === ethers.getAddress($address))}
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
        <Button class="px-3 text-white" color=primary on:click={() => filtersStore.addAddressToOwner(true)}>
          <IconPlus color="white" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Button>
      </ButtonGroup>
    </div>
    <div class="space-x-2 mb-2">
      {#each $owners as owner}
      <span title="{owner.hash}">
        <Button on:click={() => filtersStore.removeOwner(owner)} size="xs">
          <Address address={owner.ens || owner.hash} ellipsis />
          <IconX class="ml-2" size={16} />
        </Button>
      </span>
      {/each}
    </div>
  </div>
  <div class="grid-child">
    <div class="mb-6">
      <Label for="stake-id" class="flex flex-col">
        <span class="mb-2">Stake Id</span>
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
          <Button class="px-3 text-white" color=primary on:click={() => filtersStore.addStakeIdToList(true)}>
            <IconPlus color="white" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Button>
        </ButtonGroup>
      </Label>
    </div>
    <div class="space-x-2 mb-2">
      {#each $stakeIds as stakeId}
      <Button on:click={() => filtersStore.removeStakeId(stakeId)} size="xs">
        {stakeId}
        <IconX class="ml-2" size={16} />
      </Button>
      {/each}
    </div>
  </div>
</div>
