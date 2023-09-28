<script lang="ts">
  import MagnitudeSelection from "../MagnitudeSelection.svelte";
  import HedronIcon from '../icons/Hedron.svelte';
  import HexIcon from '../icons/Hex.svelte';
  import {
    newStakeDaysSelection,
    newStakeAmountSelection,
    repeatStakeDaysOptions,
    disableRepeatStakeAmountDropdownDuring,
    repeatStakeAmountOptions,
    hexTipSelection,
    hedronTipSelection,
  } from "../../stores/settings";
</script>
<div class="flex flex-col col-span-1">
  <div class="flex flex-row">
    <div class="flex flex-col flex-grow">
      <MagnitudeSelection
        label="Repeat Stake Days"
        on:change={(e) => { newStakeDaysSelection.set(e.detail.value) }}
        showDenominatorNever
        nullIsZero
        disableInputDuring={[0, 2, 3]}
        maxUint={16}
        options={$repeatStakeDaysOptions}
        suffix="Day(s)" />
    </div>
  </div>
</div>
<div class="flex flex-col col-span-1">
  <MagnitudeSelection
    label="Repeat Stake Amount"
    on:change={(e) => { newStakeAmountSelection.set(e.detail.value) }}
    showDenominatorWhenOver={3}
    maxUint={64}
    suffix="HEX"
    disabledDropdownDuring={$disableRepeatStakeAmountDropdownDuring}
    disableInputDuring={$disableRepeatStakeAmountDropdownDuring}
    options={$repeatStakeAmountOptions}>
    <span class="flex flex-col items-center min-w-[28px]" slot="before">
      <HexIcon class="mt-2" size={28} />
    </span>
  </MagnitudeSelection>
</div>
<div class="grid grid-cols-2 col-span-2 gap-4">
  <div class="flex flex-col col-span-1">
    <MagnitudeSelection
      label="Tip"
      on:change={(e) => { hexTipSelection.set(e.detail.value) }}
      showDenominatorWhenOver={2}
      maxUint={64}
      suffix="HEX"
      disableInputDuring={[0]}
      options={[{
        value: 0,
        text: 'Off',
        inputText: 'off',
      }, {
        value: 1,
        text: 'Constant',
        inputText: '',
      }, {
        value: 3,
        text: '% of Total',
        inputText: '',
      }, {
        value: 4,
        text: '% of Principle',
        inputText: '',
      }, {
        value: 5,
        text: '% of Yield',
        inputText: '',
      }]}>
      <span class="flex flex-col items-center min-w-[28px]" slot="before">
        <HexIcon class="mt-2" size={28} />
      </span>
    </MagnitudeSelection>
  </div>
  <div class="flex flex-col col-span-1">
    <MagnitudeSelection
      label="Tip"
      on:change={(e) => { hedronTipSelection.set(e.detail.value) }}
      showDenominatorWhenOver={3}
      maxUint={64}
      suffix="HDRN"
      disableInputDuring={[0]}
      options={[{
        value: 0,
        text: 'Off',
        inputText: 'off',
      }, {
        value: 1,
        text: 'Constant',
        inputText: '',
      }, {
        value: 4,
        text: '% of Total',
        inputText: '',
      }, {
        value: 5,
        text: '% of Principle',
        inputText: '',
      }, {
        value: 6,
        text: '% of Yield',
        inputText: '',
      }]}>
      <span class="flex flex-col items-center min-w-[28px]" slot="before">
        <HedronIcon size={28} class="mt-2" />
      </span>
    </MagnitudeSelection>
  </div>
</div>
