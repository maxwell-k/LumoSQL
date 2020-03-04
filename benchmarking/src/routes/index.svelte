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
  import { column, join } from "../utils/format.mjs";

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
  table.all {
    table-layout: fixed;
  }
  .test {
    white-space: nowrap;
  }
  table.medians col:first-child {
    width: 1rem;
  }
  thead thead td[colspan] {
    text-align: center;
  }
  td:first-child {
    text-align: left;
  }
  td {
    text-align: right;
  }
  .versions {
    border-bottom: thin solid black;
    text-align: center;
  }
  tbody tr:nth-child(even) {
    background: #dddddd;
  }
  tbody tr:nth-child(odd) {
    background: #ffffff;
  }
  tbody td {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }
  col {
    width: 8rem;
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
    <h2>Underlying data in one table</h2>

    <p>
      {runs.length} run{runs.length - 1 ? 's' : ''}: {join(runs)}, measured in
      seconds.
    </p>

    <dl>
      {#each versions as version, index}
        <dt>{column(index)}</dt>
        <dd>
          <code>{version}</code>
        </dd>
      {/each}
    </dl>

    <table class="all">
      <colgroup>
        <col />
        {#each runs as run}
          {#each versions as version}
            <col />
          {/each}
        {/each}
      </colgroup>
      <thead>
        <tr>
          <td />
          {#each runs as run}
            <td class="versions" colspan={versions.length}>{run}</td>
          {/each}
        </tr>
        <tr>
          <td />
          {#each runs as run}
            {#each versions as version, index}
              <td>{column(index)}</td>
            {/each}
          {/each}
        </tr>
      </thead>

      <tbody>
        {#each tests as test}
          <tr>
            <td class="test">
              <code>{test}</code>
            </td>

            {#each runs as run}
              {#each versions as version}
                <td>
                  {nested
                    .get(run)
                    .get(version)
                    .get(test)
                    .toFixed(digits)}
                </td>
              {/each}
            {/each}

          </tr>
        {/each}
      </tbody>
    </table>
  </div>

</details>
