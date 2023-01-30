import { Publisher } from "@lukekaalim/net-common";
import { ConnectionDescription, ConnectionTypeTriplet } from "@lukekaalim/net-description";
import { IncomingMessage } from 'http';

export type ServerConnection<T extends ConnectionTypeTriplet> = {
  query: T['query'],
  socket: WebSocket,
  request: IncomingMessage,

  recievePublisher: Publisher<T["client"]>,

  send: (message: T['server']) => void,
};

export type WebSocketRoute = {
  path: string,
  handleConnection: (socket: WebSocket, request: IncomingMessage) => void,
};

export type WebSocketListener = (
  socket: WebSocket,
  request: IncomingMessage,
) => void;


export const createWebSocketListener: (routes: WebSocketRoute[]) => WebSocketListener;
export const createJSONConnectionRoute: <T extends ConnectionTypeTriplet>(
  description: ConnectionDescription<T>,
  handler: (connection: ServerConnection<T>) => unknown,
) => WebSocketRoute;