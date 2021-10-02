// @flow strict
/*:: import type { Cast, JSONValue } from '@lukekaalim/cast'; */ 
/*:: import type { ResourceDescription, Resource, Authorization } from '@lukekaalim/net-description';*/

/*:: import type { HTTPMethod, HTTPStatus, HTTPHeaders } from './http'; */
/*:: import type { Route, RouteHandler, RouteRequest, RouteResponse } from './route'; */

/*:: import type { CacheOptions } from './cache'; */
/*:: import type { Content } from './content'; */
/*:: import type { AccessOptions } from './access'; */

import { HTTP_METHOD, HTTP_STATUS } from '@lukekaalim/net-description';

import { createRoute } from './route.js';

import { createCacheHeaders } from './cache.js';
import { createAccessHeaders } from './access.js';

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
  const allowedMethods = Object.keys(resource.methods);

  const disallowedMethodHandler = (request) => {
    return {
      status: HTTP_STATUS.method_not_allowed,
      body: null,
      headers: {
        ...createCacheHeaders(resource.cache),
        ...createAccessHeaders(request.headers, resource.access),
        allow: allowedMethods.join(',')
      }
    };
  };
  const optionsHandler = (request) => {
    return {
      status: HTTP_STATUS.no_content,
      body: null,
      headers: {
        ...createCacheHeaders(resource.cache),
        ...createAccessHeaders(request.headers, resource.access),
        allow: allowedMethods.join(',')
      }
    };
  }

  const defaultMethods/*: [string, RouteHandler][]*/ = [
    ...Object.values(HTTP_METHOD).map(method => [(method/*: any*/), disallowedMethodHandler]),
    [HTTP_METHOD.options, optionsHandler]
  ];

  // Wrap the provided route handler with
  // the headers that come with a resource
  const createRouteHandler = (routeHandler) => async (request) => {
    const response = await routeHandler(request);
    return {
      ...response,
      headers: {
        ...createCacheHeaders(resource.cache),
        ...createAccessHeaders(request.headers, resource.access),
        ...response.headers,
      }
    };
  };

  const implementedMethods/*: [string, RouteHandler][]*/ = [
    ...defaultMethods,
    ...Object.entries(resource.methods)
      .map(([method, routeHandler]) => [method, createRouteHandler((routeHandler/*: any*/))]),
  ];

  return [...new Map(implementedMethods)]
    .map(([method, routeHandler]) => ({
      handler: routeHandler,
      method: (method/*: any*/),
      path: resource.path
    }));
};


/*::
export type ResourceRequest<Query, Body> = {
  routeRequest: RouteRequest,
  headers: HTTPHeaders,
  query: Query,
  body: Body,
};
export type ResourceResponse<Body> = {
  headers?: HTTPHeaders,
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

export const createJSONResourceRoutes = /*:: <T: Resource>*/(
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
        headers: responseHeaders = {}
      } = await methodImplementation({
        query,
        headers: routeRequest.headers,
        body: requestBody,
        routeRequest
      });
      return createJSONResponse(status, responseBody || null, responseHeaders);
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
