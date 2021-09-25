// @flow strict
/*:: import type { HTTPMethod, HTTPStatus } from './http'; */

/*::
type HTTPRequest = {
  url: string | URL,
  headers: {| +[string]: string |},
  method: HTTPMethod,
  body?: null | string | Uint8Array,
};

type HTTPResponse = {
  status: HTTPStatus,
  headers: {| +[string]: string |},
  body: string,
};

type HTTPClient = {
  sendRequest: (request: HTTPRequest) => Promise<HTTPResponse>,
};

export type {
  HTTPClient,
  HTTPRequest,
  HTTPResponse,
  HTTPMethod,
  HTTPStatus,
};
*/

export * from './node.js';
export * from './web.js';
export * from './resource.js';
export * from './authorization.js';
