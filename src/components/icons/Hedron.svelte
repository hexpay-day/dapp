<script lang="ts">
  export let alt = 'a white dodecahedron on a blue background'
  export let size = 20
  let className = ''
  export { className as class }
  export let title = ''
</script>
<img width="{size}" height="{size}" class={className} {alt} src="/hedron.png" {title} />