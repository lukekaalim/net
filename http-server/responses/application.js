// @flow strict
/*:: import type { HTTPStatus, HTTPHeaders } from '@lukekaalim/net-description'; */
/*:: import type { JSONValue } from '../json'; */
/*:: import type { RouteResponse } from '../route'; */
import { stringify } from '../json.js';

export const createJSONResponse = (
  status/*: HTTPStatus*/,
  bodyValue/*: JSONValue*/,
  headers/*: HTTPHeaders*/ = {}
)/*: RouteResponse*/ => {
  const body = Buffer.from(stringify(bodyValue));
  const contentHeaders = {
    'content-type': 'application/json',
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
