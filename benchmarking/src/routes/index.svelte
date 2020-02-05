<script context="module">
  export async function preload() {
    const res = await this.fetch(`data.json`);
    const dataset = await res.json();
    return { dataset };
  }
</script>

<script>
  export let dataset;

  import {
    arraysToMaps,
    getRunNames,
    getTestNames,
    getVersions,
    median
  } from "../utils/arrange.mjs";
  import { column } from "../utils/format.mjs";
  import All from "./_components/All.svelte";

  const digits = 4;
  const runs = getRunNames(dataset);
  const versions = getVersions(dataset);
  const tests = getTestNames(dataset);
  const nested = arraysToMaps(dataset.runs);
  const paths = dataset.paths;
</script>

<style>
  p.intro {
    width: 15rem;
  }
  table.medians col:first-child {
    width: 1rem;
  }
  td.rotate {
    text-align: left;
    vertical-align: top;
    position: relative;
  }
  td.rotate div {
    transform-origin: left top;
    transform: rotate(-30deg);
    position: absolute;
    margin-left: 25%;
    bottom: 0rem;
    width: 30rem;
  }
  table.medians {
    margin-top: 10rem;
  }
  tfoot,
  .number {
    font-style: italic;
  }
  td.version {
    text-align: left;
    white-space: nowrap;
  }
</style>

<svelte:head>
  <title>{dataset.metadata.title}</title>
</svelte:head>

<h1>{dataset.metadata.title}</h1>

<p class="intro">
  Median across {runs.length} run{runs.length - 1 ? 's' : ''} in seconds.
</p>

<table class="medians">
  <colgroup>
    <col />
    {#each tests as test}
      <col />
    {/each}
  </colgroup>
  <thead>
    <tr>
      <td />
      {#each tests as test}
        <td class="rotate">
          <div>{test}</div>
        </td>
      {/each}
      <td />
      <td class="version">Version</td>
    </tr>
  </thead>
  <tbody>
    {#each versions as version, index}
      <tr>
        <td>{column(index)}</td>

        {#each tests as test}
          <td>
            {median(runs.map(run => nested
                  .get(run)
                  .get(version)
                  .get(test))).toFixed(digits)}
          </td>
        {/each}

        <td>{column(index)}</td>
        <td class="version">{version}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <td />
      {#each tests as test, index}
        <td>{index + 1}</td>
      {/each}
    </tr>
  </tfoot>
</table>

<details>
  <summary>JSON</summary>
  <ul>
    <li>
      <a href="/data.json" data-cy="data">data.json</a>
      includes the data extracted from the HTML reports.
    </li>
    <li>
      <a href="/schema.json" data-cy="schema">schema.json</a>
      is a
      <a href="https://json-schema.org/">JSON Schema</a>
      for that file.
    </li>
  </ul>
</details>

<details>
  <summary>Raw data</summary>
  <ul>
    {#each paths as path}
      <li>
        <a href={path}>{path}</a>
      </li>
    {/each}
  </ul>
</details>

<details>
  <summary>All data in one table</summary>
  <div>
    <All {dataset} />
  </div>
</details>

<details>
  <summary>Key</summary>
  <h2>Versions</h2>
  <dl>
    {#each versions as version, index}
      <dt>{column(index)}</dt>
      <dd>{version}</dd>
    {/each}
  </dl>

  <h2>Tests</h2>
  <dl>
    {#each tests as test, index}
      <dt class="number">{index + 1}</dt>
      <dd>{test}</dd>
    {/each}
  </dl>
</details>
