// @flow strict
import { toBase64, fromBase64 } from './base64.js'; 

/*::
export type BasicAuthorization = {|
  type: 'basic',
  username: string,
  password: string,
|};

export type BearerAuthorization = {|
  type: 'bearer',
  token: string,
|};

export type Authorization =
  | BasicAuthorization
  | BearerAuthorization
*/

export const encodeAuthorizationHeader = (authorization/*: Authorization*/)/*: string*/ => {
  switch (authorization.type) {
    case 'bearer':
      return `Bearer ${authorization.token}`;
    case 'basic':
      return `Basic ${toBase64(`${authorization.username}:${authorization.password}`)}`;
  }
};

export const decodeAuthorizationHeader = (header/*: string*/)/*: Authorization*/ => {
  const [schema, content] = header.split(' ', 2);

  switch (schema) {
    case 'Basic':
      const [username, password] = fromBase64(content).split(':');
      return { type: 'basic', username, password }; 
    case 'Bearer':
      const token = content;
      return { type: 'bearer', token };
    default:
      throw new Error(`Unknown Authorization`);
  }
};