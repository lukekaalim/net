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
    
  throw new Error();
};