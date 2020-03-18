<script>
  export let dataSets;
  export let segment;
</script>

<style>
  span,
  a {
    padding-left: 0.2em;
  }
</style>

<nav>
  {#each dataSets as dataSet}
    {#if segment === dataSet}
      <span>{dataSet}</span>
    {:else}
      <a href="overview/{dataSet}">{dataSet}</a>
    {/if}
  {/each}
</nav>
