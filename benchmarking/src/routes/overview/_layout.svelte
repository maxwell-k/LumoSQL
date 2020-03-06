<script context="module">
  export async function preload() {
    const res = await this.fetch("datasets.json");
    const versions = await res.json();
    return { versions };
  }
</script>

<script>
  export let versions, segment;
</script>

<style>
  span,
  a {
    padding-left: 0.2em;
  }
</style>

<p>
  {#each versions as version}
    {#if segment === version}
      <span>{version}</span>
    {:else}
      <a href="overview/{version}">{version}</a>
    {/if}
  {/each}
</p>
<slot />
