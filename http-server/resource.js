// @flow strict
/*:: import type { Cast, JSONValue } from '@lukekaalim/cast'; */ 
/*:: import type { ResourceDescription, ResourceTypeArg, Authorization } from '@lukekaalim/net-description';*/

/*:: import type { HTTPMethod, HTTPStatus, HTTPHeaders } from './http'; */
/*:: import type { Route, RouteHandler, RouteRequest, RouteResponse } from './route'; */

/*:: import type { CacheOptions } from './cache'; */
/*:: import type { Content } from './content'; */
/*:: import type { AccessOptions } from './access'; */

import { createRoute } from './route.js';

import { createCacheHeaders } from './cache.js';
import { createAccessHeaders } from './access.js';
import { statusCodes, toMethod } from './http.js';

import { readJSONBody } from './content.js';
import { createJSONResponse } from './responses.js';

/*
A HTTP _resource_ is a collection of routes than handle various methods for a single path.
It abstracts over certain headers, like content-type and content-length and authorization.
*/
/*::
export type HTTPResource = {
  methods: { [method: HTTPMethod]: RouteHandler },
  path: string,
  access?: AccessOptions,
  cache?: CacheOptions,
};
*/

export const createResourceRoutes = (resource/*: HTTPResource*/)/*: Route[]*/ => {
  const defaultMethods/*: { [method: HTTPMethod]: RouteHandler }*/ = {
    OPTIONS: (request) => ({ status: statusCodes.noContent, body: null, headers: {} }),
  };
  const createRouteHandler = (method) => async (request) => {
    const response = await allMethods[method](request);
    return {
      ...response,
      headers: {
        ...createCacheHeaders(resource.cache),
        ...createAccessHeaders(request.headers, resource.access),
        ...response.headers,
      }
    };
  };
  const allMethods = { ...defaultMethods, ...resource.methods };
  return Object
    .keys(allMethods)
    .map(toMethod)
    .map((method) => createRoute(method, resource.path, createRouteHandler(method)))
};


/*::
export type ResourceRequest<Query, Body> = {
  routeRequest: RouteRequest,
  headers: HTTPHeaders,
  query: Query,
  body: Body,
};
export type ResourceResponse<Body> = {
  body?: Body,
  status: HTTPStatus,
};

type RequestHandler<T> = (request: ResourceRequest<T['query'], T['request']>) =>
  | ResourceResponse<T['response']>
  | Promise<ResourceResponse<T['response']>>

type ResourceImplementation<T> = {|
  access?: AccessOptions,
  cache?: CacheOptions,

  GET?:     RequestHandler<T['GET']>,
  POST?:    RequestHandler<T['POST']>,
  DELETE?:  RequestHandler<T['DELETE']>,
  PUT?:     RequestHandler<T['PUT']>,
  PATCH?:   RequestHandler<T['PATCH']>,
|};
*/

export const createJSONResourceRoutes = /*:: <T: ResourceTypeArg>*/(
  description/*: ResourceDescription<T>*/,
  implementation/*: ResourceImplementation<T>*/
)/*: Route[]*/ => {
  const createRouteHandler = (methodDescription, methodImplementation)/*: ?RouteHandler*/ => {
    if (!methodDescription || !methodImplementation)
      return null;

    const { toQuery, toRequestBody } = methodDescription;

    const routeHandler = async (routeRequest) => {
      const query = toQuery && toQuery(Object.fromEntries(routeRequest.query.entries()));
      const requestBody = toRequestBody && toRequestBody(await readJSONBody(routeRequest.incoming, routeRequest.headers));
      const {
        body: responseBody,
        status,
      } = await methodImplementation({
        query,
        headers: routeRequest.headers,
        body: requestBody,
        routeRequest
      });
      return createJSONResponse(status, responseBody || null);
    };
    return routeHandler;
  };

  const methods = Object.fromEntries([
    ['GET',     createRouteHandler(description.GET,     implementation.GET)],
    ['POST',    createRouteHandler(description.POST,    implementation.POST)],
    ['DELETE',  createRouteHandler(description.DELETE,  implementation.DELETE)],
    ['PUT',     createRouteHandler(description.PUT,     implementation.PUT)],
    ['PATCH',   createRouteHandler(description.PATCH,   implementation.PATCH)],
  ].map(([a, b]) => b ? [a, b] : null).filter(Boolean));

  return createResourceRoutes({
    access: implementation.access,
    cache: implementation.cache,
    path: description.path,
    methods,
  });
};
