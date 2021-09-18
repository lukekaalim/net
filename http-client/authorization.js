// @flow strict
/*:: import type { HTTPClient } from './main.js'; */
import { toBase64 } from './base64.js';

/*::
export type Authorization =
  | {| type: 'basic', username: string, password: string |}
  | {| type: 'none' |}
  | {| type: 'bearer', token: string |}
*/

export const createBasicAuthorization = (username/*: string*/, password/*: string*/)/*: Authorization*/ => ({
  type: 'basic',
  username,
  password,
});

export const createBearerAuthorization = (token/*: string*/)/*: Authorization*/ => ({
  type: 'bearer',
  token,
});

export const createNoneAuthorization = ()/*: Authorization*/ => ({
  type: 'none'
});

export const createAuthorizationValue = (authorization/*: Authorization*/)/*: null | string*/ => {
  switch (authorization.type) {
    default:
    case 'none':
      return null;
    case 'basic':
      return `Basic ${toBase64(authorization.username + ':' + authorization.password)}`;
    case 'bearer':
      return `Bearer ${authorization.token}`;
  }
};

export const createAuthorizedClient = (client/*: HTTPClient*/, authorization/*: Authorization*/)/*: HTTPClient*/ => {
  const auth = createAuthorizationValue(authorization);
  const sendRequest = async (request) => {
    const headers = {
      ...request.headers,
      ...(auth ? { Authorization: auth } : {}),
    };
    const response = await client.sendRequest({ ...request, headers });
    switch (response.status) {
      case 401:
        throw new Error(`Unauthorized Request`);
      case 403:
        throw new Error(`Forbidden Request`);
    }
    return response;
  };

  return {
    sendRequest,
  };
};