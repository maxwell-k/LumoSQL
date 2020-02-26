/* global process */
import { mapsToArrays, metadata, runs } from "../utils/read.mjs";

const path = process.env.DATA || "test/data";

export async function get(req, res) {
  const data = {};
  data.runs = mapsToArrays(await runs(path));
  data.metadata = await metadata(path);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}
