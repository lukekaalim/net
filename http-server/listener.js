// @flow strict
/*::
import type { IncomingMessage, ServerResponse } from 'http';
import type { Route, RouteHandler, RouteResponse } from './route';
*/
import { writeStream } from './stream.js';
import { statusCodes } from './http.js';
import { getRouteRequest, writeOutgoingResponse, createRouteResponse } from './route.js';
const { internalServerError, notFound } = statusCodes;


/*::
export type HTTPListener = (
  request: IncomingMessage,
  response: ServerResponse, 
) => void;
*/

export const createFixedListener = (routeResponse/*: RouteResponse*/)/*: HTTPListener*/ => {
  const listener = (_, res) => {
    res.writeHead(routeResponse.status, routeResponse.headers);
    writeStream(res, routeResponse.body || null);
  };
  return listener;
};
  
export const createRouteListener = (
  routes/*: Route[]*/,
  fallbackListener/*: HTTPListener*/ = createFixedListener(createRouteResponse(notFound)),
)/*: HTTPListener*/ => {
  const routeMap = new Map(routes.map(route => [route.method + route.path, route]));
  const listener = async (httpRequest, httpResponse) => {
    try {
      const routeRequest = getRouteRequest(httpRequest);
      const { method, path } = routeRequest;
      const route = routeMap.get(method + path);
      if (!route)
        return fallbackListener(httpRequest, httpResponse);

      try {
        const response = await route.handler(routeRequest)
        writeOutgoingResponse(httpResponse, response);
      } catch (error) {
        writeOutgoingResponse(httpResponse, createRouteResponse(internalServerError))
      }
    } catch (error) {
      httpResponse.end();
    }
  };

  return (req, res) => void listener(req, res);
};