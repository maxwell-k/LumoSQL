<script>
  import {
    arraysToMaps,
    getRunNames,
    getTestNames,
    getVersions
  } from "../../utils/arrange.mjs";
  import { column, join } from "../../utils/format.mjs";

  export let dataset;

  const digits = 4;
  const runs = getRunNames(dataset);
  const tests = getTestNames(dataset);
  const versions = getVersions(dataset);
  const nested = arraysToMaps(dataset.runs);
</script>

<style>
  table {
    table-layout: fixed;
  }
  .test {
    white-space: nowrap;
  }
  thead thead td[colspan] {
    text-align: center;
  }
  .versions {
    border-bottom: thin solid black;
    text-align: center;
  }
</style>

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

<table>
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
