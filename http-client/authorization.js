// @flow strict
/*:: import type { Authorization } from '@lukekaalim/net-description'; */
/*:: import type { HTTPClient } from './main.js'; */
import { encodeAuthorizationHeader } from '@lukekaalim/net-description';


export const createAuthorizedClient = (client/*: HTTPClient*/, authorization/*: ?Authorization*/ = null)/*: HTTPClient*/ => {
  const auth = authorization && encodeAuthorizationHeader(authorization);
  const sendRequest = async (request) => {
    const headers = {
      ...request.headers,
      ...(auth ? { 'authorization': auth } : {}),
    };
    return client.sendRequest({ ...request, headers });
  };

  return {
    sendRequest,
  };
};