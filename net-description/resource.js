// @flow strict
/*:: import type { Cast } from '@lukekaalim/cast'; */ 

/*::
export type ResourceMethodDescription<T> = {
  toQuery?:        Cast<T['query']>,
  toRequestBody?:  Cast<T['request']>,
  toResponseBody?: Cast<T['response']>,
};

export type ResourceDescription<T> = {|
  path:    string,

  GET?:     ?ResourceMethodDescription<T['GET']>,
  POST?:    ?ResourceMethodDescription<T['POST']>,
  DELETE?:  ?ResourceMethodDescription<T['DELETE']>,
  PUT?:     ?ResourceMethodDescription<T['PUT']>,
  PATCH?:   ?ResourceMethodDescription<T['PATCH']>,
|}

export type ResourceTypeArg = {
  [string]: {
    query: any,
    request: any,
    response: any,
  }
};
*/