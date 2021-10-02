// @flow strict
/*:: import type { IncomingMessage } from 'http'; */
/*:: import type { IncomingMessage as SIncomingMessage} from 'https'; */
/*:: import type { WebSocketRoute } from './route.js'; */
/*:: import { WebSocket } from 'ws'; */

/*::
export type WebSocketListener = (
  socket: WebSocket,
  request: IncomingMessage | SIncomingMessage
) => void;
*/

export const createWebSocketListener = (routes/*: WebSocketRoute[]*/)/*: WebSocketListener*/ => {
  const routeByPath = new Map(routes.map(route => [route.path, route]));
  const listener = (socket, request) => {
    const url = new URL(request.url, 'http://example.com');
    const route = routeByPath.get(url.pathname);
    if (!route)
      throw new Error();
    route.handleConnection(socket, request);
  };

  return listener;
};