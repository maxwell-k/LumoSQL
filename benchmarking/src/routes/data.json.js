/* global process */
import path from "path";

import {
  directories,
  files,
  mapsToArrays,
  metadata,
  runs
} from "../utils/read.mjs";
import { prefix } from "../config.js";

const root = process.env.DATA || path.join(prefix, "test");

export async function get(req, res) {
  const data = {};
  data.runs = mapsToArrays(await runs(root));
  data.metadata = await metadata(root);
  data.paths = [];
  for (const directory of await directories(root)) {
    for (const file of await files(path.join(root, directory))) {
      data.paths.push(path.relative(prefix, file));
    }
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
