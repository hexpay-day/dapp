<script lang=ts>
  export let link = ''
  export let text = ''
  export let color = true
</script>
<a href={link} target="_blank" class={color ? "text-blue-500 underline" : ''}>{#if text}{text}{:else}<slot />{/if}</a>