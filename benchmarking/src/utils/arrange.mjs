/**
 * @file Arranges data for presentation
 * @author Keith Maxwell
 */

/**
 * Get a sorted array of run names from a JSON dataset
 * @param dataset {object} Data set to process
 */
export function getRunNames(dataset) {
  const digits = /^[0-9]+$/;
  const output = [];
  dataset.runs.forEach(([run]) => {
    if (output.indexOf(run) === -1) output.push(run);
  });
  return output.sort((a, b) => {
    if (digits.test(a) && digits.test(b)) return a - b;
    else return a.localeCompare(b);
  });
}
/**
 * Get the list of the versions from a JSON dataset
 * @param dataset {object} Data set to process
 */
export function getVersions(dataset) {
  const output = [];
  dataset.runs.forEach(([, versions]) =>
    versions.forEach(([version]) => {
      if (output.indexOf(version) === -1) output.push(version);
    })
  );
  return output;
}
/**
 * Get an array of test names JSON dataset
 * @param dataset {object} Data set to process
 */
export function getTestNames(dataset) {
  const output = [];
  dataset.runs.forEach(([, versions]) =>
    versions.forEach(([, tests]) =>
      tests.forEach(([name]) => {
        if (output.indexOf(name) === -1) output.push(name);
      })
    )
  );
  return output;
}
/**
 * Recursively converts JSON back to nested maps
 * @param input {array} To convert
 */
export function arraysToMaps(input) {
  const result = new Map();
  input.forEach(([key, value]) => {
    if (value instanceof Array) result.set(key, arraysToMaps(value));
    else result.set(key, value);
  });
  return result;
}
/**
 * Median from a list of numbers
 *
 * @param {Array} numbers An array of numbers
 * @return {Number} The calculated median value from the input numbers
 */
export function median(numbers) {
  const length = numbers.length;
  if (length % 2 == 1) return numbers[(length - 1) / 2];
  else return (numbers[length / 2] + numbers[length / 2 - 1]) / 2;
}
/**
 * Medians for a dataset
 *
 * @param {Map} runs A map of maps of maps of numbers
 * @return {Map} A map of maps of medians
 */
export function medians(runs) {
  const arrays = new Map();
  for (const runValue of runs.values()) {
    for (const [version, versionValue] of runValue) {
      if (!arrays.has(version)) arrays.set(version, new Map());
      for (const [test, testValue] of versionValue) {
        if (!arrays.get(version).has(test)) arrays.get(version).set(test, []);
        arrays
          .get(version)
          .get(test)
          .push(testValue);
      }
    }
  }
  const output = new Map(arrays);
  for (const [version, versionValue] of arrays) {
    for (const [test, values] of versionValue) {
      output.get(version).set(test, median(values));
    }
  }
  return output;
}
