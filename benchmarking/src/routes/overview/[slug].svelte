<script context="module">
  export async function preload(page) {
    const name = page.params.slug;
    const route = `datasets/${name}.json`;
    const res = await this.fetch(route);
    const dataset = await res.json();
    return { dataset, route };
  }
</script>

<script>
  export let dataset, route;

  import {
    arraysToMaps,
    getRunNames,
    getTestNames,
    getVersions,
    medians
  } from "../../utils/arrange.mjs";
  import { column } from "../../utils/format.mjs";
  import All from "../../components/All.svelte";

  const runs = getRunNames(dataset);
  const versions = getVersions(dataset);
  const tests = getTestNames(dataset);
  const table = medians(arraysToMaps(dataset.runs));
  const paths = dataset.paths;

  let denominatorIndex = null;
</script>

<style>
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

<p>
  Median across {runs.length} run{runs.length - 1 ? 's' : ''} {denominatorIndex === null ? 'in seconds' : `as a multiple of row ${column(denominatorIndex)}`}.
</p>

<table class="medians">
  <thead>
    <tr>
      <td />
      <td class="rotate">
        <div>
          <strong>Normalise</strong>
        </div>
      </td>
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
        <td>
          <input type="radio" bind:group={denominatorIndex} value={index} />
        </td>
        {#each tests as test}
          <td>
            {(table
                .get(version)
                .get(
                  test
                ) / (denominatorIndex === null ? 1 : table
                    .get(versions[denominatorIndex])
                    .get(test))).toFixed(denominatorIndex === null ? 4 : 2)}
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
      <td>
        <input type="radio" bind:group={denominatorIndex} value={null} />
      </td>
      {#each tests as test, index}
        <td>{index + 1}</td>
      {/each}
      <td />
    </tr>
  </tfoot>
</table>

<details>
  <summary>JSON</summary>
  <ul>
    <li>
      <a href="/{route}" data-cy="data">{route}</a>
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
