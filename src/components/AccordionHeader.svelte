<script lang="ts">
  import _ from 'lodash'
  export let length: number | undefined = undefined
</script>
<p>{#if _.isNumber(length)}<i class="font-light">{length}</i>: {/if}<slot /></p>
