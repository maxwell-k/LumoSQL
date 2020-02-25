import { promises as fsPromises } from "fs";

import yaml from "js-yaml";

export async function get(req, res) {
  const yaml_schema = await fsPromises.readFile("schema.yaml", {
    encoding: "utf8"
  });
  const json_schema = yaml.safeLoad(yaml_schema);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(json_schema));
}
