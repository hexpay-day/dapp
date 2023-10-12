<script lang="ts">
  import * as types from '../types'
  import classnames from 'classnames'
	import {
    IconChevronsRight, IconQuestionMark,
  } from "@tabler/icons-svelte"
  import { queryParam, ssp } from "sveltekit-search-params"
  import * as rpcQueries from '../stores/rpc-queries'
	import {
    Button,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte"
	import CheckoutButton from './CheckoutButton.svelte'
	import HexPayDayIcon from './icons/HexPayDay.svelte'
	import MaintenanceSetting from './MaintenanceSetting.svelte'
	import SignForGoodAccount from './SignForGoodAccount.svelte'
	import DoTokenizeHsi from './DoTokenizeHsi.svelte'
	import DoDepositHsiApproval from './DoDepositHsiApproval.svelte'
	import { addToSequence, existsInSequence, removeFromSequence } from '../stores/sequence'
	import * as addresses from '../stores/addresses'
	import * as web3Store from '../stores/web3'
	import * as contracts from '../stores/contracts'
	import { TaskType, type TimelineTypes } from '../types'
	import { ethers } from "ethers"
	import ConnectWallet from "./ConnectWallet.svelte"
	import { renderIcon } from '../stores/filtered-stakes';
	import { onMount } from 'svelte';
  const { chainId, address, connected } = web3Store
  export let stake!: types.Stake
  export let options!: types.TimelineTypes[]
  let dropdownOpen = false
  let showCheckout = false
  let buttonDisabled = false
  let checkoutReversable = false
  const { TimelineTypes } = types
  const timelineTypeQueryParam = queryParam('selected', ssp.string(), {
    pushHistory: false,
    debounceHistory: 3_000,
  })
  $: existingStakeManagerIsOwner = ethers.getAddress(stake.owner) === addresses.ExistingStakeManager
  const defaultClass = (disabled: boolean) => (
    classnames('font-medium py-2 pl-4 pr-6 text-md hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left flex', {
      'cursor-not-allowed': disabled,
    })
  )
  const selectTokenizeHsi = () => {
    showCheckout = true
    dropdownOpen = false
    timelineTypeQueryParam.set(TimelineTypes.TOKENIZE_HSI)
    buttonDisabled = true
  }
  const selectDepositHsi = () => {
    showCheckout = true
    dropdownOpen = false
    timelineTypeQueryParam.set(TimelineTypes.DEPOSIT_HSI)
    buttonDisabled = false
    checkoutReversable = existsInSequence({
      type: taskTypeFromTimelineType(TimelineTypes.DEPOSIT_HSI),
      task: {
        stake,
      },
    })
  }
  const selectWithdrawHsi = () => {
    showCheckout = true
    dropdownOpen = false
    timelineTypeQueryParam.set(TimelineTypes.WITHDRAW_HSI)
    buttonDisabled = false
    checkoutReversable = existsInSequence({
      type: taskTypeFromTimelineType(TimelineTypes.WITHDRAW_HSI),
      task: {
        stake,
      },
    })
  }
  const selectUpdateStake = () => {
    showCheckout = true
    dropdownOpen = false
    timelineTypeQueryParam.set(TimelineTypes.UPDATE)
    buttonDisabled = true
  }
  const selectGoodAccount = () => {
    showCheckout = true
    dropdownOpen = false
    timelineTypeQueryParam.set(TimelineTypes.GOOD_ACCOUNT)
    buttonDisabled = false
    checkoutReversable = existsInSequence({
      type: taskTypeFromTimelineType(TimelineTypes.GOOD_ACCOUNT),
      task: {
        stake,
      },
    })
  }
  const selectEndStake = () => {
    showCheckout = true
    dropdownOpen = false
    timelineTypeQueryParam.set(TimelineTypes.END)
    buttonDisabled = !ownerCanEndFromSigner && !ownerIsPerpetual
    checkoutReversable = existsInSequence({
      type: taskTypeFromTimelineType(TimelineTypes.END),
      task: {
        stake,
      },
    })
  }
  const selectRestartStake = () => {
    showCheckout = true
    dropdownOpen = false
    timelineTypeQueryParam.set(TimelineTypes.RESTART_STAKE)
  }
  const timelineTypesToTask = new Map<TimelineTypes, TaskType>([
    [TimelineTypes.DEPOSIT_HSI, TaskType.depositHsi],
    [TimelineTypes.WITHDRAW_HSI, TaskType.withdrawHsi],
    [TimelineTypes.GOOD_ACCOUNT, TaskType.goodAccount],
    [TimelineTypes.END, TaskType.endStake],
  ])
  const taskTypeFromTimelineType = (t = timelineType) => timelineTypesToTask.get(t) as TaskType
  const typeToSelect = new Map<TimelineTypes, () => void>([
    [TimelineTypes.TOKENIZE_HSI, selectTokenizeHsi],
    [TimelineTypes.DEPOSIT_HSI, selectDepositHsi],
    [TimelineTypes.WITHDRAW_HSI, selectWithdrawHsi],
    [TimelineTypes.UPDATE, selectUpdateStake],
    [TimelineTypes.GOOD_ACCOUNT, selectGoodAccount],
    [TimelineTypes.END, selectEndStake],
    [TimelineTypes.RESTART_STAKE, selectRestartStake],
  ])
  let filteredOptions: types.TimelineTypes[] = []
  $: {
    filteredOptions = $address ? options.filter((option) => {
      switch (option) {
        case types.TimelineTypes.DEPOSIT_HSI:
          return ethers.getAddress(stake.owner) === $address
        case types.TimelineTypes.WITHDRAW_HSI:
          return existingStakeManagerIsOwner
        case types.TimelineTypes.TOKENIZE_HSI:
          return ethers.getAddress(stake.owner) === $address
            && !stake.tokenized
        default:
          return true
      }
    }) : []
  }
  $: timelineType = ($timelineTypeQueryParam || filteredOptions[0]) as types.TimelineTypes
  // run selected option for the first time
  $: typeToSelect.get(timelineType)?.()
  const checkoutDepositHsi = async () => {
    const all = contracts.all($chainId, null)
    const [tokenIds, settings, settingsEncoded] = await Promise.all([
      rpcQueries.getTokenIdsUnder($chainId, $address),
      all.existingStakeManager.defaultSettings(),
      all.existingStakeManager.defaultEncodedSettings(),
    ])
    const hsiAddressToTokenId = await rpcQueries.getCustodianToTokenIds($chainId, tokenIds)
    const tokenId = hsiAddressToTokenId.get(ethers.getAddress(stake.custodian))
    if (!tokenId) throw new Error('unable to find token id')
    addToSequence(TaskType.depositHsi, {
      tokenId,
      stake,
      settings,
      settingsEncoded: settingsEncoded,
    }, {
      contract: types.ContractType.ExistingStakeManager,
    })
  }
  const checkoutWithdrawHsi = async () => {
    const all = contracts.all($chainId, null)
    const owner = await all.existingStakeManager.stakeIdToOwner(stake.custodian)
    if (owner !== $address) throw new Error('unable to end someone else\'s stake')
    addToSequence(TaskType.withdrawHsi, {
      stake,
    }, {
      contract: types.ContractType.ExistingStakeManager,
    })
  }
  const checkoutGoodAccountStake = async () => {
    addToSequence(TaskType.goodAccount, {
      stake,
    })
  }
  const checkoutEndStake = async () => {
    const contract = stake.isHedron || ownerIsPerpetual
      ? types.ContractType.ExistingStakeManager
      : types.ContractType.StakeManager
    addToSequence(TaskType.endStake, {
      stake,
    }, {
      contract,
    })
  }
  const checkout = () => {
    switch (timelineType) {
      case TimelineTypes.DEPOSIT_HSI:
        return checkoutDepositHsi()
      case TimelineTypes.WITHDRAW_HSI:
        return checkoutWithdrawHsi()
      case TimelineTypes.GOOD_ACCOUNT:
        return checkoutGoodAccountStake()
      case TimelineTypes.END:
        return checkoutEndStake()
    }
  }
  const reverseCheckoutAction = () => {
    removeFromSequence({
      type: taskTypeFromTimelineType(timelineType),
      task: {
        stake,
      },
    })
    typeToSelect.get(timelineType)?.()
  }
  const checkoutAction = () => {
    const result = checkout()
    if (result) {
      return result.then(() => {
        typeToSelect.get(timelineType)?.()
      })
    }
  }
  const ownerIsPerpetual = addresses.perpetuals.has(stake.owner)
  const ownerCanEndFromSigner = stake.owner === addresses.ExistingStakeManager
  const canShow = (option: types.TimelineTypes, against: types.TimelineTypes) => (
    option === against && timelineType !== against
  )
</script>

<div class="flex flex-row justify-between grid-flow-row min-h-[42px]">
  <div class="flex">
    <Button size="sm"><IconChevronsRight /></Button>
    <Dropdown bind:open={dropdownOpen} placement="right">
      {#each filteredOptions as option}
        {#if canShow(option, TimelineTypes.TOKENIZE_HSI)}
        <DropdownItem
          defaultClass={defaultClass(false)}
          on:click={selectTokenizeHsi}>
          <MaintenanceSetting type={TimelineTypes.TOKENIZE_HSI} />
        </DropdownItem>
        {:else if canShow(option, TimelineTypes.DEPOSIT_HSI)}
        <DropdownItem
          defaultClass={defaultClass(false)}
          on:click={selectDepositHsi}>
          <MaintenanceSetting type={TimelineTypes.DEPOSIT_HSI} />
        </DropdownItem>
        {:else if canShow(option, TimelineTypes.WITHDRAW_HSI)}
        <DropdownItem
          defaultClass={defaultClass(false)}
          on:click={selectWithdrawHsi}>
          <MaintenanceSetting type={TimelineTypes.WITHDRAW_HSI} />
        </DropdownItem>
        {:else if canShow(option, TimelineTypes.UPDATE)}
        <DropdownItem
          defaultClass={defaultClass(false)}
          on:click={selectUpdateStake}>
          <MaintenanceSetting type={TimelineTypes.UPDATE} />
        </DropdownItem>
        {:else if canShow(option, TimelineTypes.GOOD_ACCOUNT)}
        <DropdownItem
          defaultClass={defaultClass(false)}
          on:click={selectGoodAccount}>
          <MaintenanceSetting type={TimelineTypes.GOOD_ACCOUNT} />
        </DropdownItem>
        {:else if canShow(option, TimelineTypes.END)}
        <DropdownItem
          defaultClass={defaultClass(false)}
          on:click={selectEndStake}>
          <MaintenanceSetting type={TimelineTypes.END} />
        </DropdownItem>
        {:else if canShow(option, TimelineTypes.RESTART_STAKE)}
        <DropdownItem
          defaultClass={defaultClass(false)}
          on:click={selectRestartStake}>
          <MaintenanceSetting type={TimelineTypes.RESTART_STAKE} />
        </DropdownItem>
        {/if}
      {/each}
    </Dropdown>
  </div>
  <div class="flex px-2 items-center flex-grow">
    <MaintenanceSetting type={timelineType} />
    {#if timelineType === TimelineTypes.GOOD_ACCOUNT}
    <SignForGoodAccount {stake} on:requested={() => {
      // invalidateAll()
      stake.requestedGoodAccounting = true
      typeToSelect.get(timelineType)?.()
    }} />
    {:else if timelineType === TimelineTypes.TOKENIZE_HSI}
    <DoTokenizeHsi {stake} />
    {:else if timelineType === TimelineTypes.DEPOSIT_HSI}
    <DoDepositHsiApproval {stake} {existingStakeManagerIsOwner} />
    {:else if timelineType === TimelineTypes.WITHDRAW_HSI}
    {#if !$connected}
    <div class="flex px-4"><ConnectWallet /></div>
    {/if}
    {:else if timelineType === TimelineTypes.UPDATE}
    <div class="flex italic px-4">
      Coming Soon
    </div>
    {:else if timelineType === TimelineTypes.END}
    <div class="flex flex-row px-4 items-center">Custodied By
      <span class="px-2">
        {#if ownerCanEndFromSigner}<HexPayDayIcon />
        {:else if ownerIsPerpetual}{@html renderIcon(stake)}
        {:else}<IconQuestionMark />
        {/if}
      </span>
    </div>
    {#if !$connected}
      <ConnectWallet />
    {/if}
    {/if}
  </div>
  {#if showCheckout}
  <div class="flex">
    <CheckoutButton
      disabled={buttonDisabled}
      requireConnected={true}
      text={checkoutReversable ? 'Remove from Sequence' : 'Add to Sequence'}
      action={checkoutReversable ? reverseCheckoutAction : checkoutAction} />
  </div>
  {/if}
</div>
