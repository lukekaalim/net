// @flow strict

/*::
interface IData {
  +data: mixed,
}
*/

export const getMessageDataString = async (event/*: { +data: mixed } | IData*/)/*: Promise<string>*/ => {
  const { data } = event;
  if (typeof Blob !== 'undefined' && data instanceof Blob)
    return await data.text()

  if (typeof data === 'string')
    return data;

  if (typeof Buffer !== 'undefined' && data instanceof Buffer)
    return data.toString('utf-8');

  if (typeof ArrayBuffer !== 'undefined' && typeof TextDecoder !== 'undefined' && data instanceof ArrayBuffer)
    return new TextDecoder().decode(data)
    
  throw new Error('No appropriate data handler to parse message data string');
};