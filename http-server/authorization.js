// @flow strict
/*:: import type { Authorization } from '@lukekaalim/net-description'; */
/*:: import type { HTTPHeaders } from './http.js'; */
import { decodeAuthorizationHeader } from "@lukekaalim/net-description";

export const getAuthorization = (headers/*: HTTPHeaders*/)/*: ?Authorization*/ => {
  const authorizationHeader = headers['authorization'];
  if (!authorizationHeader)
    return null;
  return decodeAuthorizationHeader(authorizationHeader);
}