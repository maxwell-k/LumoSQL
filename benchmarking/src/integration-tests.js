#!/usr/bin/env node
/* eslint-env node */

const startAndTest = require("start-server-and-test");

const start = "node __sapper__/build";
const test = "yarn run cypress run";
const url = "http://127.0.0.1:3000/";

console.log('Waiting for "%s" to respond with HTTP status code 200…', url);

startAndTest({ start, url, test }).catch(e => {
  console.error(e);
  process.exit(1);
});
