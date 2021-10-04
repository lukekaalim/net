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


export const getRangeStartOffset = (bodyLength/*: number*/, directive/*: RangeDirective*/)/*: number*/ => {
  const { start } = directive;
  switch (start.type) {
    case 'offset':
      return start.offset;
    case 'offset-from-end':
      return bodyLength - start.offset;
  }
};
export const getRangeEndOffset = (bodyLength/*: number*/, directive/*: RangeDirective*/)/*: number*/ => {
  const { end } = directive;
  switch (end.type) {
    case 'offset':
      return end.offset;
    case 'end-of-document':
      return bodyLength;
  }
};

/*::
export type RangeResponseHead = {
  status?: HTTPStatus,
  slice?: { start: number, end: number },
  headers: HTTPHeaders
}
*/

export const getRangeResponseHead = (range/*: RequestRange*/, bodyLength/*: number*/)/*: RangeResponseHead*/ => {
  if (!range)
    return { headers: { 'accept-ranges': 'bytes' } }

  const [directive] = range.directives;
  const start = getRangeStartOffset(bodyLength, directive);
  const end = getRangeEndOffset(bodyLength, directive);

  const contentRangeHeader = `bytes ${start}-${end - 1}/${bodyLength}`;
  const headers = {
    'content-length': bodyLength.toString(),
    'content-range': contentRangeHeader
  }
  return { headers, slice: { start, end }, status: HTTP_STATUS.partical_content };
}
