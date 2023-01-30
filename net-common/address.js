// @flow strict

export const getLocalAddress = (address/*: net$Socket$address | string*/, protocol/*: string*/)/*: string*/ => {
  if (typeof address === 'string')
    return address;
  const { port } = address;
  return `${protocol}://127.0.0.1:${port}`;
}