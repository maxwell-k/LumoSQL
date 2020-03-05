/* global process */
import path from "path";

import {
  directories,
  files,
  mapsToArrays,
  metadata,
  runs
} from "../utils/read.mjs";
import { COLLECTION, DEFAULT_DATA_SET, PREFIX } from "../config.js";

const root =
  process.env.DATA || path.join(PREFIX, COLLECTION, DEFAULT_DATA_SET);

export async function get(req, res) {
  const data = {};
  data.runs = mapsToArrays(await runs(root));
  data.metadata = await metadata(root);
  data.paths = [];
  for (const directory of await directories(root)) {
    for (const file of await files(path.join(root, directory))) {
      data.paths.push(path.relative(PREFIX, file));
    }
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
