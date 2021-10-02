// @flow strict
/*:: import type { Cast } from '@lukekaalim/cast'; */ 

/*::
export type ResourceMethodDescription<T = any> = {
  toQuery?:        Cast<T['query']>,
  toRequestBody?:  Cast<T['request']>,
  toResponseBody?: Cast<T['response']>,
};

export type ResourceDescription<T = any> = {|
  path:    string,

  GET?:     ?ResourceMethodDescription<T['GET']>,
  POST?:    ?ResourceMethodDescription<T['POST']>,
  DELETE?:  ?ResourceMethodDescription<T['DELETE']>,
  PUT?:     ?ResourceMethodDescription<T['PUT']>,
  PATCH?:   ?ResourceMethodDescription<T['PATCH']>,
|}

export type ResourceMethod<Query = any, Request = any, Response = any> = {
  query: Query,
  request: Request,
  response: Response,
};

export type Resource = {
  [string]: ResourceMethod<any>
};
*/