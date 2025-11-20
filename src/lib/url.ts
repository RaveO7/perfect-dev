export const ensureTrailingSlash = (url: string): string => (url.endsWith('/') ? url : `${url}/`)

