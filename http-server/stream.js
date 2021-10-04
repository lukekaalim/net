// @flow strict
/*:: import type { Readable, Writable } from 'stream'; */

export const readStream = async (stream/*: Readable*/, length/*: null | number*/)/*: Promise<string>*/ => {
  switch (typeof length) {
    case 'number':
      return await readStreamFixedLength(stream, length);
    default:
    case null:
      return await readStreamUnknownLength(stream);
  }
};

export const readStreamUnknownLength = (readable/*: Readable*/)/*: Promise<string>*/ => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    readable.setEncoding('utf8');
    readable.on('data', data => chunks.push(data));
    readable.on('error', error => reject(error));
    readable.on('end', () => resolve(chunks.join('')));
  });
};

export const readStreamFixedLength = async (readable/*: Readable*/, length/*: number*/)/*: Promise<string>*/ => {
  const buffer = Buffer.alloc(length);
  let offset = 0;
  for await (const chunk of readable) {
    if (typeof chunk === 'string')
      buffer.write(chunk, offset);
    else
      chunk.copy(buffer, offset);
    offset += chunk.length;
  }
  return buffer.toString();
};


export const writeStream = (writable/*: Writable*/, value/*: null | string | Buffer | Readable*/) => {
  if (typeof value === 'string' || value instanceof Buffer)
    writable.end(value);
  else if (value === null)
    writable.end();
  else
    value.pipe(writable);
};

export const readStreamBytes = async (readable/*: Readable*/, length/*: ?number*/ = null)/*: Promise<Buffer>*/ => {
  if (length === 0)
    return Buffer.alloc(0);
  
  const chunks = [];
  for await (const chunk of readable) {
    if (chunk instanceof Buffer) {
      chunks.push(chunk);
    }
  }

  return Buffer.concat(chunks, length || undefined);
};