// @flow strict
/*:: import type { IncomingMessage } from 'http' */
/*:: import type { IncomingMessage as SIncomingMessage } from 'https' */
/*:: import type { Connection, ConnectionDescription } from '@lukekaalim/net-description'; */
/*:: import type { WebSocketRoute } from './route'; */
/*::
import { WebSocket } from 'ws';
import type { Publisher } from '@lukekaalim/net-common'
*/
import { createEventPublisher } from "@lukekaalim/net-common";

/*::
export type ServerConnection<T: Connection<>> = {
  query: T['query'],
  socket: WebSocket,
  request: IncomingMessage | SIncomingMessage,

  recievePublisher: Publisher<T["client"]>,

  send: (message: T['server']) => void,
};
*/

export const createJSONConnectionRoute = /*:: <T: Connection<>>*/(
  { path, castQuery, castClientMessage, castServerMessage }/*: ConnectionDescription<T>*/,
  handler/*: (connection: ServerConnection<T>) => mixed */
)/*: WebSocketRoute*/ => {

  const handleConnection =  (socket/*: WebSocket*/, request/*: IncomingMessage | SIncomingMessage*/) => {
    const recievePublisher = createEventPublisher();

    const onMessage = (message/*: MessageEvent & { data: Buffer | Buffer[], isBinary: boolean }*/) => {
      try {
        if (!castClientMessage)
          return;
        const { data } = message;
        if (data instanceof Buffer) {
          const clientMessage = JSON.parse(data.toString('utf-8'));
          return recievePublisher.publish(castClientMessage(clientMessage));
        }
        if (typeof data === 'string') {
          const clientMessage = JSON.parse(data);
          return recievePublisher.publish(castClientMessage(clientMessage));
        }
        throw new Error();
      } catch (error) {
        console.error('Invalid socket message')
        console.error(error);
      }
    }
    socket.addEventListener('message', onMessage);
    
    const send = (message/*: T["server"]*/) => {
      const data = Buffer.from(JSON.stringify(message));
      socket.send(data);
    };
    const url = new URL(request.url, 'ws://example.com');
    
    const query = castQuery && castQuery(Object.fromEntries(url.searchParams.entries())) || {};

    const connection = {
      query,
      socket,
      request,

      recievePublisher,

      send,
    }

    handler(connection);
  };

  return {
    path: path,
    handleConnection,
  }
};
