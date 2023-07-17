<script>
  import "../app.css";
  import { DarkMode, Footer, FooterCopyright } from 'flowbite-svelte';
  import ConnectWallet from '../components/ConnectWallet.svelte'
</script>

<div class="pb-16">
  <DarkMode />
  <ConnectWallet />
  <slot />
  <Footer class="fixed bottom-0 left-0 w-full rounded-none">
    <div class="container">
      <FooterCopyright href="/" by="HexPay.Day" year={(new Date()).getFullYear()} />
    </div>
  </Footer>
  <!-- add a little extra spacing -->
  <div class="w-full h-4"></div>
</div>

<style lang="postcss">
  :global(html) {
    height: 100%;
  }
  :global(html, body) {
    min-height: 100%;
  }
</style>
