// @flow strict
/*:: import type { HTTPHeaders } from './http'; */

/*::
export type CacheOptions = {
  expires?: Date,
  cacheability?: 'public' | 'private' | 'no-store' | 'no-cache',
  maxAge?: number,
  mustRevalidate?: boolean,
};
*/

export const createCacheHeaders = ({ expires, cacheability, maxAge, mustRevalidate }/*: CacheOptions*/ = {})/*: HTTPHeaders*/ => {
  const cacheControlDirectives = [
    cacheability,
    maxAge && `max-age=${maxAge}`
  ].filter(Boolean);
  if (cacheControlDirectives.length < 1)
    return {};
  const cacheControlHeader = cacheControlDirectives.join(' ,');
  return {
    'cache-control': cacheControlHeader,
  };
};