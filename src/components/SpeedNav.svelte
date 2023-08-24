<script lang="ts">
  import * as web3Store from '../stores/web3'
  import {
    SpeedDial,
    SpeedDialButton,
  } from 'flowbite-svelte'
	import { goto } from "$app/navigation";
  import {
    defaultOffsetDays,
  } from '../stores/filtered-stakes'
  import {
    currentDay,
    getCurrentDay,
  } from '../stores/day'
	import { onMount } from 'svelte';
  import FilterPath from './FilterPath.svelte'
	import { IconAtom2, IconFlame, IconSearch, IconShoppingCart } from '@tabler/icons-svelte';

  onMount(async () => {
    if ($currentDay) {
      return
    }
    getCurrentDay()
  })

  const chainId = web3Store.chainId

  const navTo = (type: string) => {
    const url = type === 'end' ? `/${$chainId}/end/${$currentDay}/${defaultOffsetDays}`
      : type === 'start' ? `/${$chainId}/start/`
      : type === 'maintain' ? `/${$chainId}/maintain/`
      : type === 'checkout' ? `/${$chainId}/checkout/` : ''
    if (!url) return
    goto(url)
  }
  const routes = [{
    key: 'start',
    name: 'Start',
    icon: 'fire',
  }, {
    key: 'end',
    name: 'End',
    icon: 'search',
  }, {
    key: 'maintain',
    name: 'Maintain',
    icon: 'atom-2',
  }, {
    key: 'checkout',
    name: 'Checkout',
    icon: 'cart',
  }]
</script>

<SpeedDial defaultClass="fixed right-4 bottom-14 z-30" trigger="hover">
  {#each routes as route}
  <FilterPath path={route.key}>
    <SpeedDialButton on:click={() => navTo(route.key)} name={route.name}>
      <!-- <Icon name={route.icon} /> -->
      {#if route.icon === 'fire'}<IconFlame />
      {:else if route.icon === 'search'}<IconSearch />
      {:else if route.icon === 'atom-2'}<IconAtom2 />
      {:else if route.icon === 'cart'}<IconShoppingCart />
      {/if}
    </SpeedDialButton>
  </FilterPath>
  {/each}
</SpeedDial>
