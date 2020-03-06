/* eslint-env node */
const resolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const commonjs = require("@rollup/plugin-commonjs");
const svelte = require("rollup-plugin-svelte");
const babel = require("rollup-plugin-babel");
const { terser } = require("rollup-plugin-terser");
const config = require("sapper/config/rollup.js");
const pkg = require("./package.json");

const configuration = require("./src/configuration.js");

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);

const commonReplace = replace({
  "process.browser": true,
  "process.env.NODE_ENV": JSON.stringify(mode),
  "process.env.COLLECTION": JSON.stringify(configuration.COLLECTION)
});

const convert = commonjs();

module.exports = {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      commonReplace,
      svelte({
        dev,
        hydratable: true,
        emitCss: true
      }),
      resolve({
        browser: true,
        dedupe: ["svelte"]
      }),
      convert,

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          runtimeHelpers: true,
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead"
              }
            ]
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true
              }
            ]
          ]
        }),

      !dev &&
        terser({
          module: true
        })
    ],

    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      commonReplace,
      svelte({
        generate: "ssr",
        dev
      }),
      resolve({
        dedupe: ["svelte"]
      }),
      convert
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules ||
        Object.keys(process.binding("natives"))
    ),

    onwarn
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [resolve(), commonReplace, convert, !dev && terser()],

    onwarn
  }
};
