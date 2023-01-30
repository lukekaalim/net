import { ConnectionDescription, ConnectionTypeTriplet } from "@lukekaalim/net-description";
import { Publisher } from "@lukekaalim/net-common";
import { ISocket } from "./socket.js";

export type ConnectionSocket<T extends ConnectionTypeTriplet> = {
  socket: ISocket,

  send: (message: T["client"]) => void,
  close: (code: number, reason: string) => void,
  message: Publisher<{ data: T["server"] }>,
}

export type ConnectionClient<T extends ConnectionTypeTriplet> = {
  connect: (query: T["query"]) => ConnectionSocket<T>,
}

export const createJSONWebSocketClient: <T extends ConnectionTypeTriplet>(
  createSocket: (url: string, subprotocol: string) => ISocket,
  description: ConnectionDescription<T>,
  origin: URL | string,
) => ConnectionClient<T>