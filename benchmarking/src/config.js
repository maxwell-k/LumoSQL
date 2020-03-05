export const PREFIX = "static";
export const COLLECTION = "test"; // test or production
export const DEFAULT_DATA_SET = "v1";
export function shouldAddCharset(pathname) {
  return (
    (pathname.startsWith("/test/") || pathname.startsWith("/production/")) &&
    pathname.endsWith(".html")
  );
}
