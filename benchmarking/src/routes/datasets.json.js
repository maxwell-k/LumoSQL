import path from "path";

import { directories } from "../utils/read.mjs";
import configuration from "../configuration.js";

export async function get(req, res) {
  const data = await directories(
    path.join(configuration.PREFIX, configuration.COLLECTION)
  );
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
