// @flow strict
/*::
import type { ConnectionDescription, Connection } from '@lukekaalim/net-description';
import { URLSearchParams } from "url";
*/

/*::
export type ClientConnection<T: Connection<>> = {
  connect: ({
    query?: T['query'],
    recieve?: (message: T['server']) => void 
  }) => Promise<{|
    send: (message: T['client']) => void,
    close: () => Promise<void>,
    socket: WebSocket,
  |}>
};
*/

export const createJSONConnectionClient = /*:: <T: Connection<>>*/(
  WebSocket/*: Class<WebSocket>*/,
  description/*: ConnectionDescription<T>*/,
  baseURL/*: URL | string*/,
)/*: ClientConnection<T>*/ => {

  const {
    castServerMessage = a => a
  } = description;

  const connect = async ({ query, recieve = _ => {} }) => {
    const url = new URL(description.path, baseURL);
    url.search = new URLSearchParams(query).toString();
    const socket = new WebSocket(url.href, [description.subprotocol].filter(Boolean));

    socket.addEventListener('message', async ({ data }/*: MessageEvent | { data: Uint8Array }*/) => {
      if (typeof Blob !== 'undefined' && data instanceof Blob)
        return recieve(castServerMessage(JSON.parse(await data.text())));

      if (typeof data === 'string')
        return recieve(castServerMessage(JSON.parse(data)))

      if (typeof Buffer !== 'undefined' && data instanceof Buffer)
        return recieve(castServerMessage(JSON.parse(data.toString('utf-8'))))
        
      throw new Error();
    });
    const send = (message) => {
      const data = JSON.stringify(message);
      socket.send(data);
    };
    const close = async () => {
      socket.close(1000, 'oops')
      await new Promise(r => socket.addEventListener('close', () => r()))
    }
    await new Promise(r => socket.addEventListener('open', () => r()))

    return { send, close, socket };
  };

  return {
    connect,
  };
};
