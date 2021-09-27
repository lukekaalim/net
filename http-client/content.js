// @flow strict
/*:: import type { HTTPHeaders } from './http.js'; */
import { encodeStringToArrayBuffer } from './encoding.js';

/*::
export type Content = {
  type: string,
  length: number,
};
*/

export const createJSONContent = (bodyValue/*: mixed*/)/*: { contentHeaders: HTTPHeaders, bufferBody: ?Uint8Array }*/ => {
  const serializedBody = JSON.stringify(bodyValue);

  if (!serializedBody)
    return { contentHeaders: {}, bufferBody: null };

  const bufferBody = encodeStringToArrayBuffer(serializedBody);

  const contentHeaders = {
    'content-type': 'application/json',
    'content-length': bufferBody.byteLength.toString(),
  };

  return { contentHeaders, bufferBody };
};
