// @flow strict
/*:: import type { IncomingMessage } from 'http' */
/*:: import type { IncomingMessage as SIncomingMessage } from 'https' */
/*:: import type { Connection, ConnectionDescription } from '@lukekaalim/net-description'; */
/*:: import type { WebSocketRoute } from './route'; */
/*:: import { WebSocket } from 'ws'; */

/*::
export type ClientConnection<T: Connection<>> = {
  query: T['query'],
  addRecieveListener: (onRecieve: (message: T['client']) => void) => { removeListener: () => void },
  send: (message: T['server']) => void,
};
*/

export const createJSONConnectionRoute = /*:: <T: Connection<>>*/(
  { path, castQuery }/*: ConnectionDescription<T>*/,
  handler/*: (connection: ClientConnection<T>, socket: WebSocket, request: IncomingMessage | SIncomingMessage) => void */
)/*: WebSocketRoute*/ => {

  const handleConnection =  (socket, request) => {
    const addRecieveListener = (onRecieve) => {
      const listener = (message) => {
        const { data } = message;
        if (data instanceof Buffer) {
          const clientMessage = JSON.parse(data.toString('utf-8'));
          return onRecieve(clientMessage);
        }
        if (typeof data === 'string') {
          const clientMessage = JSON.parse(data);
          return onRecieve(clientMessage);
        }
        throw new Error();
      };
      socket.addEventListener('message', listener);
      const removeListener = () => {
        socket.addEventListener('message', listener);
      }
      return {
        removeListener,
      };
    };
    const send = (message) => {
      const data = Buffer.from(JSON.stringify(message));
      socket.send(data);
    };
    const url = new URL(request.url, 'ws://example.com');
    
    const query = castQuery && castQuery(Object.fromEntries(url.searchParams.entries()));

    const connection = {
      addRecieveListener,
      send,
      query,
    }

    handler(connection, socket, request);
  };

  return {
    path: path,
    handleConnection,
  }
};
