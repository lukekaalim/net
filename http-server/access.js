// @flow strict
/*:: import type { HTTPHeaders } from './http'; */

/*::
export type AccessOriginOptions =
  | { type: 'whitelist', origins: string[] }
  | { type: 'wildcard' }
  | { type: 'none' }

export type AccessOptions = {
  origins?: AccessOriginOptions,
  headers?: string[],
  cache?: number,
};
*/

export const createOriginWhitelist = (origins/*: string[]*/)/*: AccessOriginOptions*/ => ({
  type: 'whitelist',
  origins
});

const createAllowedOrigin = (headers/*: HTTPHeaders*/, options/*: AccessOriginOptions*/) => {
  switch (options.type) {
    case 'wildcard':
      return '*';
    case 'whitelist':
      return options.origins.includes(headers['origin']) ? headers['origin'] : null;
  }
}

export const createAccessHeaders = (headers/*: HTTPHeaders*/, access/*: AccessOptions*/ = {})/*: HTTPHeaders*/ => {
  const allowedOrigin = access.origins ? createAllowedOrigin(headers, access.origins) : null;
  const allowedHeaders = access.headers ? access.headers.join(' ,') : null;
  const maxAge = access.cache || null;
  return Object.fromEntries([
    allowedOrigin ? ['access-control-allow-origin', allowedOrigin] : null,
    allowedHeaders ? ['access-control-allow-headers', allowedHeaders] : null,
    allowedHeaders ? ['access-control-allow-headers', allowedHeaders] : null,
    maxAge ? ['access-control-max-age', maxAge.toString()] : null,
  ].filter(Boolean));
};
