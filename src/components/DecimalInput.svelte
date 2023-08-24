<script lang="ts">
	import { ethers } from 'ethers';
  import {
    Input,
  } from 'flowbite-svelte'
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import type { InputType } from 'flowbite-svelte/dist/types';
	import _ from 'lodash';

  export let decimals = 8
  export let defaultText = ''
  export let placeholder = ''
  export let zeroIsNull = false
  export let nullIsZero = false
  // const maxUint256 = ethers.constants.MaxUint256.toBigInt()
  // const minInt256 = ethers.constants.MinInt256.toBigInt()
  export let max: bigint | null = null
  export let min: bigint | null = null
  export let id = ''
  export let infiniteAt: null | bigint = null
  export let validate = (_p: bigint) => true
  let inputClass = ""
  export { inputClass as class }
  export let uint = true
  export let type: InputType = 'text'
  export let disabled = false
  export let maxUint = ethers.constants.MaxUint256.toBigInt()
  export const value = writable<null | bigint>(null)
	const dispatch = createEventDispatcher();
  value.subscribe(($value) => {
    dispatch('update', {
      value: $value
    })
  })
  export let text = defaultText
  const infinityCharacter = '∞'
  const validAmount = (amount: string) => {
    let amnt = amount.trim().split(infinityCharacter).join('')
    if (amnt !== amount) {
      text = amnt
    }
    if (amnt.split('.').length > 2) {
      value.set(null)
      return false
    }
    if (amnt.slice(-1) === '.') {
      amnt = amnt.slice(0, amnt.length - 1)
    }
    try {
      if (!amnt && !nullIsZero) {
        value.set(null)
        return null
      }
      amnt = amnt === '' && nullIsZero ? '0' : amnt
      const parsed = ethers.utils.parseUnits(amnt, decimals).toBigInt()
      if (parsed === 0n && zeroIsNull) {
        value.set(parsed)
        return null
      }
      if (uint && parsed < 0n) {
        value.set(null)
        return false
      }
      if (infiniteAt && parsed >= infiniteAt) {
        value.set(infiniteAt)
        text = infinityCharacter
        return true
      }
      if (parsed > maxUint) {
        value.set(null)
        return false
      }
      if (!_.isNil(max) && parsed > max) {
        text = ethers.utils.formatUnits(max, decimals)
        value.set(max)
        return true
      }
      if (!_.isNil(min) && parsed < min) {
        text = ethers.utils.formatUnits(min, decimals)
        value.set(min)
        return true
      }
      if (!validate(parsed)) {
        value.set(null)
        return false
      }
      value.set(parsed)
      return true
    } catch(err) {
      // console.log(err)
      value.set(null)
      return false
    }
  }
  $: amountIsValid = validAmount(text)
  const keyupHandler = (e: any) => {
    const val = (e.currentTarget as unknown as HTMLInputElement).value
    text = val
  }
</script>
<Input
  bind:value={text}
  on:keyup={keyupHandler}
  {id}
  {disabled}
  {type}
  class={`${inputClass} decimal-input`}
  {placeholder}
  color={disabled ? 'base' : amountIsValid ? 'green' : amountIsValid === false ? 'red' : 'base'} />
