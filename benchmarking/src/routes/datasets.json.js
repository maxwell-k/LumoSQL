import path from "path";

import { directories } from "../utils/read.mjs";
import { COLLECTION, PREFIX } from "../config.js";

export async function get(req, res) {
  const data = await directories(path.join(PREFIX, COLLECTION));
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
