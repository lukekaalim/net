// @flow strict
/*:: import type { ResourceDescription, ResourceMethodDescription, ResourceTypeArg } from '@lukekaalim/net-description'; */
/*:: import type { HTTPClient } from './main.js'; */
/*:: import type { HTTPMethod } from './http.js'; */

import { encodeStringToArrayBuffer } from "./encoding.js";

/*::
export type ResourceMethodHandler<T: ResourceTypeArg[string]> = (request?: { query?: T['query'], body?: T['request'] }) =>
  Promise<{| body: T['response'], status: number |}>

export type ResourceClient<T> = {|
  GET:    ResourceMethodHandler<T['GET']>,
  POST:   ResourceMethodHandler<T['POST']>,
  PUT:    ResourceMethodHandler<T['PUT']>,
  DELETE: ResourceMethodHandler<T['DELETE']>,
  PATCH:  ResourceMethodHandler<T['PATCH']>,
|};
*/

export const createJSONResourceClient = /*:: <T: ResourceTypeArg>*/(
  desc/*: ResourceDescription<T>*/,
  client/*: HTTPClient*/,
  baseURL/*: string*/,
)/*: ResourceClient<T>*/ => {
  const createMethodHandler = /*:: <M: ResourceTypeArg[string]>*/(
    method/*: HTTPMethod*/,
    methodDesc/*: ?ResourceMethodDescription<M>*/
  )/*: ResourceMethodHandler<M>*/ => {
    if (!methodDesc)
      return () => { throw new Error('Method not implemented') };
    const { toResponseBody } = methodDesc;
    const methodHandler = async ({ query = {}, body: requestBody } = {}) => {
      const queryEntries = Object.entries(query)
        .map(([p, v]) => typeof v === 'string' ? [p, v] : null)
        .filter(Boolean);
      const searchParams = new URLSearchParams(queryEntries);
      const url = new URL(desc.path, baseURL);
      url.search = searchParams.toString();
      const requestBodyBuffer = encodeStringToArrayBuffer(JSON.stringify(requestBody) || '')
      try {
        const { body: responseBodyString, headers, status } = await client.sendRequest({
          method, url,
          headers: {
            'content-type': 'application/json',
            'content-length': requestBodyBuffer.byteLength.toString(),
          },
          body: requestBodyBuffer
        });

        const responseBody = toResponseBody && toResponseBody(JSON.parse(responseBodyString));
        return ({ body: responseBody, status }/*: any*/);
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