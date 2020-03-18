<script context="module">
  export async function preload() {
    const res = await this.fetch("datasets.json");
    const dataSets = await res.json();
    return { dataSets };
  }
</script>

<script>
  import DataSetNav from "../../components/DataSetNav.svelte";
  export let dataSets, segment;
</script>

<DataSetNav {dataSets} {segment} />
<slot />
