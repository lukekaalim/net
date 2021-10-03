// @flow strict
/*:: import type { Authorization, HTTPHeaders } from '@lukekaalim/net-description'; */
import { decodeAuthorizationHeader } from "@lukekaalim/net-description";

export const getAuthorization = (headers/*: HTTPHeaders*/)/*: ?Authorization*/ => {
  const authorizationHeader = headers['authorization'];
  if (!authorizationHeader)
    return null;
  return decodeAuthorizationHeader(authorizationHeader);
}