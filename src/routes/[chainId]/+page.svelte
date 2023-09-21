<script lang=ts>
  import { page } from "$app/stores";
	import { IconBook2, IconFlame } from "@tabler/icons-svelte";
</script>

<section class="bg-white dark:bg-gray-900">
  <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
      <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">HexPay.Day</h1>
      <p class="mb-4 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Transparent and audited contracts to manage your $HEX stakes efficiently and with ease.</p>
      <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Stake solo, earn tips by ending stakes, start stakes for your cold wallet, just do it with less gas. ⛽🚫</p>

      <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <a href="{$page.data.chainId}/start" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
              Start a stake
              <IconFlame />
          </a>
          <a href="https://hexpay-day.github.io/stake-manager/" target="_blank" class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
              Check the Docs
              <IconBook2 />
          </a>
      </div>
  </div>
</section>
