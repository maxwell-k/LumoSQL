/* Configurable as environment variables
 *
 * Be careful to replace process.env references in ../rollup.config.js
 */
/* eslint-disable no-undef */
export const COLLECTION = process.env.COLLECTION || "test"; // or production
/* eslint-enable no-undef */

/* Other configuration */
export const PREFIX = "static";
export const DEFAULT_DATA_SET = "v1";
export const CHARSET_DIRECTORIES = ["test", "production"];
export const CHARSET_TAIL = ".html";
