<script lang="ts">
  export let size = 20
  let className = ''
  export { className as class }
  export let alt = 'three pink hexagons nested inside of one another'
</script>
<img width="{size}" height="{size}" class={className} {alt} src="/hex.svg" />
