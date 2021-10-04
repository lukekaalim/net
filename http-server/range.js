// @flow strict
/*::
import type { HTTPStatus } from "../net-description/http";
import type { HTTPHeaders } from "@lukekaalim/net-description";

import { HTTP_STATUS } from "../net-description/http";
*/

/*::

export type RangeDirective = {
  start: { type: 'offset', offset: number } | { type: 'offset-from-end', offset: number },
  end: { type: 'offset', offset: number } | { type: 'end-of-document' },
}

export type RequestRange = {
  unit: 'bytes', // we only accept "bytes" as the range
  directives: RangeDirective[],
};
*/

export const getRequestRange = (headers/*: HTTPHeaders*/)/*: ?RequestRange*/ => {
  const rangeHeader = headers['range'];
  if (!rangeHeader)
    return null;

  const [unit, directiveText] = rangeHeader.split('=', 2);
  if (unit !== 'bytes')
    return null;
    
  const directives = directiveText
    .split(', ')
    .map(rangeBlock => {
        const [startOffset, endOffset] = rangeBlock.split('-', 2).map(s => s !== '' ? parseInt(s, 10) : null);
        // start-
        if (endOffset === null && startOffset !== null)
          return { start: { type: 'offset', offset: startOffset }, end: { type: 'end-of-document' } };
        // -end
        if (endOffset !== null && startOffset === null)
        return { start: { type: 'offset-from-end', offset: endOffset }, end: { type: 'end-of-document' } };

        if (endOffset === null || startOffset === null)
          throw new Error('???');

        // start-end
        return { start: { type: 'offset', offset: startOffset }, end: { type: 'offset', offset: endOffset } }
      });

  return { unit, directives };
};


export const getRangeStartOffset = (body/*: Buffer*/, directive/*: RangeDirective*/)/*: number*/ => {
  const { start } = directive;
  switch (start.type) {
    case 'offset':
      return start.offset;
    case 'offset-from-end':
      return body.byteLength - start.offset;
  }
};
export const getRangeEndOffset = (body/*: Buffer*/, directive/*: RangeDirective*/)/*: number*/ => {
  const { end } = directive;
  switch (end.type) {
    case 'offset':
      return end.offset;
    case 'end-of-document':
      return body.byteLength;
  }
};

// make sure to combine this with another response to add more details!
export const writeRangeResponse = (range/*: ?RequestRange*/, body/*: Buffer*/)/*: { status: HTTPStatus, body: Buffer, headers: HTTPHeaders }*/ => {
  // we only support singlepart ranges for now
  if (!range)
    return { status: HTTP_STATUS.ok, body, headers: { 'accept-ranges': 'bytes' } }

  const [directive] = range.directives;
  const start = getRangeStartOffset(body, directive);
  const end = getRangeEndOffset(body, directive);
  const totalLength = body.byteLength;
  const slicedBody = body.slice(start, end);

  const contentRangeHeader = `bytes ${start}-${end - 1}/${totalLength}`;
  const headers = {
    'content-length': slicedBody.byteLength.toString(),
    'content-range': contentRangeHeader
  }

  return { status: HTTP_STATUS.partical_content, body: slicedBody, headers };
};