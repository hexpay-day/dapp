<script lang=ts>
  export let link = ''
  export let text = ''
</script>
<a href={link} target="_blank" class="text-blue-500 underline">{#if text}{text}{:else}<slot />{/if}</a>