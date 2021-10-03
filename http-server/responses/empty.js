// @flow strict
/*:: import type { HTTPStatus, HTTPHeaders } from '@lukekaalim/net-description'; */
/*:: import type { RouteResponse } from '../route'; */
import { statusCodes } from '../http.js';
const { noContent } = statusCodes;

export const createEmptyResponse = (status/*: HTTPStatus*/ = noContent, headers/*: HTTPHeaders*/ = {})/*: RouteResponse*/ => ({
  status,
  headers: { ...headers, 'content-length': '0' },
  body: null,
});
