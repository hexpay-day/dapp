<script>
	import { page } from "$app/stores";
  export let path = ''
</script>
{#if path && !$page.route.id?.includes(path)}
  <slot />
{/if}