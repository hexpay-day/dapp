<script lang="ts">
  import NetworkIndicator from '../components/NetworkIndicator.svelte'
  import {
    IconPlane,
    IconBrandGithub,
    IconBrandTwitter,
  } from '@tabler/icons-svelte'
</script>
<footer class="bg-white md:flex md:items-center md:justify-between dark:bg-gray-800 bottom-0 left-0 w-full rounded-none p-2 shadow-inner fixed">
  <div class="container m-auto flex justify-between">
    <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <span class="p-1">
        <a href="https://t.me/+pVPSr--8_SI0MWQx">
          <IconPlane /> <!-- name="papper-plane-solid" size="sm"-->
        </a>
      </span>
      <span>HexPay.Day</span>
      <span class="p-1">
        <a href="https://github.com/hexpay-day/">
          <IconBrandGithub /> <!-- name="github-solid" size="sm"-->
        </a>
      </span>
      <span class="p-1">
        <a href="https://twitter.com/HexPay_Day">
          <IconBrandTwitter /> <!-- name="twitter-solid" size="sm"-->
        </a>
      </span>
    </span>
    <div class="flex relative">
      <NetworkIndicator />
    </div>
  </div>
</footer>
