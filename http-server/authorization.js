// @flow strict
/*:: import type { HTTPHeaders } from './http'; */

/*::
export type Authorization =
  | {| type: 'unknown'  |}
  | {| type: 'none' |}
  | {| type: 'basic', username: string, password: string |}
  | {| type: 'bearer', token: string |}
*/

export const getAuthorization = (headers/*: HTTPHeaders*/)/*: Authorization*/ => {
  const authorizationValue = headers['authorization'];

  if (!authorizationValue)
    return { type: 'none' };
  const [type, credentials] = authorizationValue.split(' ', 2);
  switch (type.toLowerCase()) {
    case 'basic': {
      const [username, password] = Buffer.from(credentials, 'base64').toString('utf8').split(':', 2);
      return { type: 'basic', username, password }
    }
    case 'bearer':
      return { type: 'bearer', token: credentials }
    default:
      return { type: 'unknown' };
  }
}
