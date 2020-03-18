const configuration = {};

// Constants
configuration.PREFIX = "static";
configuration.DEFAULT_DATA_SET = "v1";
configuration.CHARSET_DIRECTORIES = ["test", "production"];
configuration.CHARSET_TAIL = ".html";

// Configuration that can be overridden as environment variables
// Be careful to add all process.env references to configuration._environment
/* global process */
configuration.environment = {
  COLLECTION: process.env.COLLECTION || "test", // or production
  NODE_ENV: process.env.NODE_ENV,
  SAPPER_LEGACY_BUILD: process.env.SAPPER_LEGACY_BUILD
};
Object.assign(configuration, configuration.environment);

// Dependendent configuration
configuration.dev = configuration.NODE_ENV === "development";
configuration.legacy = !!configuration.SAPPER_LEGACY_BUILD;

/* global module */
module.exports = configuration;
