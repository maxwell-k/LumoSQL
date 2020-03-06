const configuration = {};

configuration.PREFIX = "static";
configuration.DEFAULT_DATA_SET = "v1";
configuration.CHARSET_DIRECTORIES = ["test", "production"];
configuration.CHARSET_TAIL = ".html";

// Configuration that can be overridden as environment variables
// Be careful to replace process.env references in ../rollup.config.js
/* global process */
configuration.COLLECTION = process.env.COLLECTION || "test"; // or production
/* global module */
module.exports = configuration;
