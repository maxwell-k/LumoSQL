import { convert, set } from "../../utils/html.mjs";

export async function get(req, res) {
  const { dataset } = req.params;
  const data = await set(`static/datasets/${dataset}/`);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(convert(data)));
}
