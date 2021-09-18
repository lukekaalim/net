// @flow

const encodeStringToArrayBuffer = (value/*: string*/)/*: Uint8Array*/ => {
  if (TextEncoder)
    return new TextEncoder().encode(value);
  if (Buffer)
    return new Buffer.from(value);
  throw new Error('No methods found to encode string to ArrayBuffer');
};

module.exports = {
  encodeStringToArrayBuffer,
};
