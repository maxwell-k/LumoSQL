import path from "path";

import {
  directories,
  files,
  mapsToArrays,
  metadata,
  runs
} from "../../utils/read.mjs";
import configuration from "../../configuration.js";

export async function get(req, res) {
  const { slug } = req.params;
  const root = path.join(configuration.PREFIX, configuration.COLLECTION, slug);

  const data = {};
  data.runs = mapsToArrays(await runs(root));
  data.metadata = await metadata(root);
  data.paths = [];
  for (const directory of await directories(root)) {
    for (const file of await files(path.join(root, directory))) {
      data.paths.push(path.relative(configuration.PREFIX, file));
    }
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
