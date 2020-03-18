/* eslint-env node */
import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

import configuration from "./configuration.js";

function shouldAddCharset(pathname) {
  return (
    configuration.CHARSET_DIRECTORIES.some(directory =>
      pathname.startsWith(`/${directory}/`)
    ) && pathname.endsWith(configuration.CHARSET_TAIL)
  );
}

polka()
  .use(
    compression({ threshold: 0 }),
    sirv(configuration.PREFIX, {
      dev,
      setHeaders: (res, pathname) => {
        /*
         * Set the charset in content-type for certain HTML files
         *
         * This is function is a workaround so that `yarn run sapper export`
         * does not fail with:
         *
         * > The "url" argument must be of type string. Received type object
         *
         * This error is caused because the html files in ./static/ do not
         * include the base tag that %sapper.base% adds. Without the correct
         * base tag, base_match in node_modules/sapper/dist/export.js is always
         * null, causing a call equivalent to:
         *
         * require('url').resolve("http://localhost:3000/test/test.html", null)
         *
         * As a workaround this function sets the content type to "text/html;
         * charset=UTF-8" and therefore avoids the calls to resolve.
         *
         * To be effective this workaround needs the change in
         * https://github.com/lukeed/sirv/commit/5ef168f48d8bea850e28d4094ea1a907f3d06a14
         *
         * At the time of writing this is only available in a pre-release like
         * https://www.npmjs.com/package/sirv/v/1.0.0-next.2
         */
        if (shouldAddCharset(pathname)) {
          res.setHeader("Content-Type", "text/html; charset=UTF-8");
        }
      }
    }),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
