<script lang="ts">
  export let alt = 'three pink hexagons with their corners touching making a piramid'
  export let size = 20
  let className = ''
  export { className as class }
  export let title = ''
</script>
<img width="{size}" height="{size}" class={className} {alt} src="/communis.png" {title} />