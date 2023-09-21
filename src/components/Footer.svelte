<script lang="ts">
  import NetworkIndicator from '../components/NetworkIndicator.svelte'
  import {
    IconBrandGithub,
    IconBrandTwitter,
    IconBrandTelegram,
  } from '@tabler/icons-svelte'
</script>
<footer class="bg-white md:flex md:items-center md:justify-between dark:bg-gray-800 bottom-0 left-0 w-full rounded-none px-4 py-1 shadow-inner fixed">
  <div class="container m-auto flex justify-between max-w-5xl">
    <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <span>HexPay.Day</span>
      <span class="p-1">
        <a target="_blank" href="https://t.me/+pVPSr--8_SI0MWQx">
          <IconBrandTelegram /> <!-- name="papper-plane-solid" size="sm"-->
        </a>
      </span>
      <span class="p-1">
        <a target="_blank" href="https://github.com/orgs/hexpay-day/repositories">
          <IconBrandGithub /> <!-- name="github-solid" size="sm"-->
        </a>
      </span>
      <span class="p-1">
        <a target="_blank" href="https://twitter.com/HexPay_Day">
          <IconBrandTwitter /> <!-- name="twitter-solid" size="sm"-->
        </a>
      </span>
    </span>
    <div class="flex relative">
      <NetworkIndicator />
    </div>
  </div>
</footer>
