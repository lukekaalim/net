// @flow strict
/*:: import type { ResourceDescription, ResourceMethodDescription, Resource } from '@lukekaalim/net-description'; */
/*:: import type { HTTPClient } from './main.js'; */
/*:: import type { HTTPMethod, HTTPHeaders } from './http.js'; */

import { encodeStringToArrayBuffer } from "./encoding.js";
import { createURL } from './url.js';
import { createJSONContent } from './content.js';

/*::
export type ResourceMethodRequest<T> = {|
  query?: T['query'],
  body?: T['request'],
  headers?: { +[string]: ?string }
|};
export type ResourceMethodResponse<T> = {|
  body: T['response'],
  status: number,
  headers: HTTPHeaders
|};
export type ResourceMethodHandler<T: Resource[string]> = (request?: ResourceMethodRequest<T>) => Promise<ResourceMethodResponse<T>>

export type ResourceClient<T> = {|
  GET:    ResourceMethodHandler<T['GET']>,
  POST:   ResourceMethodHandler<T['POST']>,
  PUT:    ResourceMethodHandler<T['PUT']>,
  DELETE: ResourceMethodHandler<T['DELETE']>,
  PATCH:  ResourceMethodHandler<T['PATCH']>,
|};
*/

export const createJSONResourceClient = /*:: <T: Resource>*/(
  desc/*: ResourceDescription<T>*/,
  client/*: HTTPClient*/,
  baseURL/*: string*/,
)/*: ResourceClient<T>*/ => {
  const createMethodHandler = /*:: <M: Resource[string]>*/(
    method/*: HTTPMethod*/,
    methodDesc/*: ?ResourceMethodDescription<M>*/
  )/*: ResourceMethodHandler<M>*/ => {
    if (!methodDesc)
      return () => { throw new Error('Method not implemented') };
    const { toResponseBody } = methodDesc;

    const methodHandler = async ({ query = {}, body: requestBody, headers: requestHeaders = {} } = {}) => {
      const url = createURL(query, desc.path, baseURL);
      const { contentHeaders, bufferBody } = createJSONContent(requestBody);
      const stringRequestHeaders = Object.fromEntries(
        Object.entries(requestHeaders)
          .map(([p, v]) => typeof v === 'string' ? [p, v] : null)
          .filter(Boolean)
      );

      try {
        const request = {
          method, url,
          headers: {
            ...stringRequestHeaders,
            ...contentHeaders,
          },
          body: bufferBody
        };
        const response = await client.sendRequest(request);
        const {
          body: responseBodyString,
          headers: responseHeaders,
          status
        } = response;

        const responseBody = toResponseBody && toResponseBody(JSON.parse(responseBodyString));

        return ({ body: responseBody, status, headers: responseHeaders }/*: any*/);
      } catch (error) {
        throw error;
      }
    };

    return methodHandler;
  };

  const GET =     createMethodHandler('GET', desc.GET);
  const POST =    createMethodHandler('POST', desc.POST);
  const PUT =     createMethodHandler('PUT', desc.PUT);
  const DELETE =  createMethodHandler('DELETE', desc.DELETE);
  const PATCH =   createMethodHandler('PATCH', desc.PATCH);

  return {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
  }
};