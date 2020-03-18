<script>
  export let status;
  export let error;

  import configuration from "../configuration.js";
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>

{#if configuration.dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
