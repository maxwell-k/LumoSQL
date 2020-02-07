<script context="module">
  export async function preload(page) {
    const { dataset } = page.params;

    const res = await this.fetch(`${dataset}.json`);
    const article = await res.json();

    return { article };
  }
</script>

<script>
  export let article;
</script>

<svelte:head>
  <title>Hello world</title>
</svelte:head>

<h1>Hello world</h1>

<code>
  <pre>
    {@html article}
  </pre>
</code>
