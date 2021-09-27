// @flow strict
/*:: import type { Readable } from 'stream'; */
/*:: import type { HTTPClient } from './main'; */
/*:: import typeof { request } from 'http'; */
/*:: import type { IncomingMessage } from 'http'; */

const readStream = async (stream/*: Readable*/) => {
  const chunks = [];
  stream.setEncoding('utf8');
  for await (const chunk of stream)
    chunks.push(chunk.toString());
  return chunks.join('');
};

export const createNodeClient = (nodeRequest/*: request*/)/*: HTTPClient*/ => {
  const sendRequest = async (request) => {
    const url = request.url instanceof URL ? request.url : new URL(request.url);

    const clientRequest = nodeRequest({
      method: request.method,
      headers: { ...(request.headers/*: { +[string]: mixed }*/) },
      path: url.pathname + url.search,
      host: url.hostname,
      port: Number.parseInt(url.port, 10),
    });
    const response = await new Promise((resolve, reject) => {
      clientRequest.on('response', async (response/*: IncomingMessage*/) => {
        try {
          response.on('error', reject);
          const body = await readStream(response);
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body,
          });
        } catch (error) {
          reject(error);
        }
      });
      clientRequest.on('error', reject);

      if (request.body)
        clientRequest.write(request.body);

      clientRequest.end();
    });

    return response;
  };
  return {
    sendRequest,
  };
};
