// @flow strict
/*:: import type { HTTPClient } from './main'; */


export const createWebClient = (fetchImplementation/*: typeof fetch*/)/*: HTTPClient*/ => {
  const handleResponse = async (response) => {
    const status = response.status;
    const headers = Object.fromEntries(response.headers.entries());
    const body = await response.text();
    return {
      status,
      headers,
      body,
    };
  };
  const sendRequest = async ({ url, headers, method, body }) => {
    return handleResponse(await fetchImplementation(url, { headers: { ...headers }, method, body }));
  };

  return {
    sendRequest,
  };
};
