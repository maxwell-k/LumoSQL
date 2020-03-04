/**
 * @file Reads the benchmarking data from disk
 * @author Keith Maxwell
 */
import { promises as fsPromises } from "fs";
import path from "path";

import cheerio from "cheerio";

/**
 * Extract the version number from HTML
 * @param {string|function} html A string or the result of a call to cheerio.load
 */
export function version(html) {
  const $ = typeof html === "string" ? cheerio.load(html) : html;
  let versions = new Set(
    $("td:not([align])")
      .map((index, element) => $(element).text())
      .toArray()
  );

  if (versions.size !== 1) {
    throw "Wrong number of versions in input";
  }

  return versions.values().next()["value"];
}

/**
 * Extract the names and times from HTML
 * @param {string|function} html A string or the result of a call to cheerio.load
 */
export function times(html) {
  const $ = typeof html === "string" ? cheerio.load(html) : html;
  const output = [];
  $("h2").each(function(index, element) {
    const h2 = $(element);
    const td = h2
      .nextAll("table")
      .first()
      .find("td[align=right]");
    output[index] = [h2.text(), Number.parseFloat(td.text())];
  });
  return output;
}

/**
 * Data from a file
 * @param file {string} A path to a file containing a report
 */
export async function report(file) {
  const html = await fsPromises.readFile(file, { encoding: "utf8" });
  const $ = cheerio.load(html);

  // https://github.com/bcoe/c8/issues/135 for explanation of ignore below
  /* c8 ignore next */
  return new Map([[version($), times($)]]);
}

/**
 * List the relevant paths
 * @param directory {string} A path to a directory containing reports
 */
export async function files(directory) {
  const filenames = await fsPromises.readdir(directory);
  const output = filenames
    .filter(i => i.endsWith("html"))
    .map(i => path.join(directory, i));
  // https://github.com/bcoe/c8/issues/135 for explanation of ignore below
  /* c8 ignore next */
  return output;
}

/**
 * Parse a run from a directory
 * @param directory {string} A path to a directory containing reports
 */
export async function run(directory) {
  const paths = await files(directory);
  const reports = await Promise.all(paths.map(report));
  reports.sort(compare);
  let output = new Map();
  reports.forEach(report => (output = new Map([...output, ...report])));
  // https://github.com/bcoe/c8/issues/135 for explanation of ignore below
  /* c8 ignore next */
  return output;
}

/**
 * List the directories
 * @param root {string} A path to a directory containing reports and metadata
 */
export async function directories(root) {
  const entries = await fsPromises.readdir(root, { withFileTypes: "true" });
  const output = entries.filter(i => i.isDirectory()).map(i => i.name);
  // https://github.com/bcoe/c8/issues/135 for explanation of ignore below
  /* c8 ignore next */
  return output;
}
/**
 * Parse a set of runs from a directory
 * @param root {string} A path to a directory containing reports and metadata
 */
export async function runs(root) {
  const paths = await directories(root);
  const output = new Map();
  for (const directory of paths) {
    const i = await run(path.join(root, directory));
    output.set(directory, i);
  }
  // https://github.com/bcoe/c8/issues/135 for explanation of ignore below
  /* c8 ignore next */
  return output;
}
/**
 * Recursively converts a map to objects suitable for JSON encoding
 * @param map {Map} To convert
 */
export function mapsToArrays(map) {
  const output = [];
  map.forEach((value, key) => {
    if (value instanceof Map) output.push([key, mapsToArrays(value)]);
    else output.push([key, value]);
  });
  return output;
}
/**
 * Comparison function to be used on LumoSQL version numbers
 * @param a {string|Map}
 * @param b {string|Map}
 */
export function compare(a, b) {
  const [a_array, b_array] = [a, b].map(i => {
    if (i instanceof Map) i = i.keys().next()["value"];
    return i
      .replace(/[._]/g, " ")
      .split(/ +/)
      .map(s => {
        const parsed = Number(s);
        return isNaN(parsed) ? s : parsed;
      });
  });
  const length = Math.min(a_array.length, b_array.length);

  if (a_array.includes("LMDB") && !b_array.includes("LMDB")) return 1;
  if (b_array.includes("LMDB") && !a_array.includes("LMDB")) return -1;

  for (let i = 0; i < length; i++) {
    if (a_array[i] > b_array[i]) return 1;
    if (a_array[i] < b_array[i]) return -1;
  }
  if (a_array.length == b_array.length) return 0;
  else if (a_array.length < b_array.length) return -1;
  else return 1;
}

/**
 * Retrieve the metadata
 * @param root {string} A path to a directory containing directories of reports
 */
export async function metadata(root) {
  const file = path.join(root, "metadata.json");
  const data = await fsPromises.readFile(file, { encoding: "utf8" });
  // https://github.com/bcoe/c8/issues/135 for explanation of ignore below
  /* c8 ignore next */
  return JSON.parse(data);
}
