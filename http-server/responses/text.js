// @flow strict
/*:: import type { HTTPStatus, HTTPHeaders } from '../http'; */
/*:: import type { RouteResponse } from '../route'; */

export const createPlainResponse = (
  status/*: HTTPStatus*/,
  bodyValue/*: string*/,
  headers/*: HTTPHeaders*/ = {}
)/*: RouteResponse*/ => {
  const body = Buffer.from(bodyValue);
  const contentHeaders = {
    'content-type': 'text/plain',
    'content-length': body.byteLength.toString(),
  };
  return {
    status,
    body,
    headers: {
      ...headers,
      ...contentHeaders,
    },
  };
};
