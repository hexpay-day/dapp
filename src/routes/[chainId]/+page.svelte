<script lang=ts>
  import { page } from "$app/stores";
	import { IconBan, IconBook2, IconFlame, IconGasStation } from "@tabler/icons-svelte";
  import A from "../../components/A.svelte"
  import IconHedron from '../../components/icons/Hedron.svelte'
</script>

<section class="bg-white dark:bg-gray-900 flex items-center px-2">
  <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
    <div class="max-w-5xl">
      <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">HexPay.Day</h1>
      <p class="mb-4 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Transparent, open source, public good, security reviewed contracts to manage your $HEX stakes efficiently and with ease.</p>
      <ol class="mb-4 text-lg font-normal text-gray-900 lg:text-xl mx-auto dark:text-white max-w-xs or-ordered-list">
        <li>Stake Solo</li>
        <li>Earn Tips by Ending Stakes</li>
        <li>Start Stakes for Cold Wallets</li>
        <li>Onboard With a New Stake</li>
        <li>Do It with Less Gas</li>
      </ol>
      <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
        <IconGasStation class="inline-block" /><IconBan class="inline-block icon-color-primary" />
      </p>

      <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        <a href="{$page.data.chainId}/start" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">Start a Stake<IconFlame /></a>
        <a href="https://docs.hexpay.day/" target="_blank" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Check the Docs<IconBook2 /></a>
      </div>
    </div>
  </div>
</section>
<section class="bg-slate-50 shadow-inner flex items-center px-2">
  <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
    <div class="max-w-5xl">
      <h3 class="text-4xl my-4">Space for Every Risk Appetite</h3>
      <div class="py-2 flex flex-col items-center">
        <ol class="mb-4 text-lg font-normal text-gray-900">
          <li>Stake with the original hex.com contract</li>
          <li>Optimize your stakes with hexpay.day contracts</li>
          <li>Allow anyone to mint tokens*</li>
          <li>Collect minted tokens at your convenience</li>
          <li>Automatically send tokens to your wallet</li>
          <li>Never forget to mint tokens* again</li>
          <li>End your HSIs</li>
          <li><A link="https://docs.hexpay.day/">Docs</A> for Integrating your protocol</li>
        </ol>
        <cite class="flex flex-row items-center text-sm">*$HEDRON <span class="px-1"><IconHedron /></span> + $COMM</cite>
      </div>
    </div>
  </div>
</section>

<style lang="postcss">
  :global(.icon-color-primary) {
    @apply text-primary-700;
  }
  .or-ordered-list > li {
    @apply px-8 relative;
  }
  .or-ordered-list > li::before {
    content: 'or';
    @apply block absolute text-center left-1 text-gray-500 dark:text-gray-400;
  }
  .or-ordered-list > li:last-child::before {
    content: '...';
  }
  .or-ordered-list > li:first-child::before {
    content: '';
  }
</style>
