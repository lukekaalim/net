// @flow strict

export const HTTP_STATUS = {
  // informational
  switching_protocols: 101,
  // success
  ok: 200,
  created: 201,
  accepted: 202,
  no_content: 204,
  partical_content: 206,
  // redirection
  not_modified: 304,
  // client error
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  method_not_allowed: 405,
  not_acceptable: 406,
  conflict: 409,
  gone: 410,
  payload_too_large: 413,
  uri_too_long: 414,
  expectation_failed: 417,
  upgrade_required: 426,
  too_many_requests: 429,
};

/*::
export type HTTPStatus = number;
*/

/*::
export type HTTPHeaders = {
  +[string]: string
};
*/

/*::
export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD'
*/
export const HTTP_METHOD/*: { [string]: HTTPMethod }*/ = {
  get:      'GET',
  post:     'POST',
  delete:   'DELETE',
  put:      'PUT',
  patch:    'PATCH',
  options:  'OPTIONS',
  head:     'HEAD',
};


/*::
export type HTTPRequest<Body> = {|
  method: HTTPMethod,
  headers: HTTPHeaders,
  body: Body
|}
*/

/*::
export type HTTPResponse<Body> = {|
  status: HTTPStatus,
  headers: HTTPHeaders,
  body: Body
|}
*/