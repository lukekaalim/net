// @flow strict
/*::
import type { WebSocket as WSWebSocket } from "ws";
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
    socket: WSWebSocket | WebSocket,
  |}>
};
*/

export const createJSONConnectionClient = /*:: <T: Connection<>>*/(
  WebSocket/*: Class<WebSocket> | Class<WSWebSocket>*/,
  description/*: ConnectionDescription<T>*/,
  baseURL/*: URL | string*/,
)/*: ClientConnection<T>*/ => {

  const connect = async ({ query, recieve = _ => {} }) => {
    const url = new URL(description.path, baseURL);
    url.search = new URLSearchParams(query).toString();
    const socket = new WebSocket(url.href, [description.subprotocol].filter(Boolean));

    socket.addEventListener('message', ({ data }/*: MessageEvent | { data: Uint8Array }*/) => {
      if (typeof data === 'string')
        return recieve(JSON.parse(data))
      if (data instanceof Buffer)
        return recieve(JSON.parse(data.toString('utf-8')))
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
