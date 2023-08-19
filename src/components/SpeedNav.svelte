<script lang="ts">
  import * as web3Store from '../stores/web3'
  import {
    SpeedDial,
    SpeedDialButton,
  } from 'flowbite-svelte'
  import {
    Icon,
  } from 'flowbite-svelte-icons'
	import { goto } from "$app/navigation";
	import { defaultOffsetDays } from "../stores/filters";
  import { currentDay, getCurrentDay } from '../stores/day'
	import { onMount } from 'svelte';

  onMount(async () => {
    if ($currentDay) {
      return
    }
    getCurrentDay()
  })

  $: chainId = web3Store.chainId

  const navTo = (type: string) => {
    const url = type === 'end' ? `/${$chainId}/end/${$currentDay}/${defaultOffsetDays}`
      : type === 'start' ? `/${$chainId}/start/`
      : type === 'maintain' ? `/${$chainId}/maintain/` : ''
    if (!url) return
    goto(url)
  }
</script>

<SpeedDial defaultClass="fixed right-4 bottom-14 z-10">
  <SpeedDialButton on:click={() => navTo('start')} name="Start">
    <Icon name="wand-magic-sparkles-outline" />
  </SpeedDialButton>
  <SpeedDialButton on:click={() => navTo('end')} name="End">
    <Icon name="search-outline" />
  </SpeedDialButton>
  <SpeedDialButton on:click={() => navTo('maintain')} name="Maintain">
    <Icon name="atom-solid" />
  </SpeedDialButton>
</SpeedDial>
