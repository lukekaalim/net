import { ConnectionDescription, ConnectionTypeTriplet } from "@lukekaalim/net-description";
import { Publisher } from "./publisher";
import { ISocket } from "./socket";

export type ConnectionSocket<T extends ConnectionTypeTriplet> = {
  send: (message: T["client"]) => void,
  close: (code: number, reason: string) => void,

  messagePublisher: Publisher<{ data: T["server"], event: Event }>,
  openPublisher: Publisher<{ event: Event }>,
  closePublisher: Publisher<{ event: CloseEvent }>,
  errorPublisher: Publisher<{ event: Event }>,
}

export type ConnectionClient<T extends ConnectionTypeTriplet> = {
  connect: (query: T["query"]) => ConnectionSocket<T>,
}

export const createJSONWebSocketClient: <T extends ConnectionTypeTriplet>(
  createSocket: (url: string, subprotocol: string) => ISocket,
  description: ConnectionDescription<T>,
  origin: URL | string,
) => ConnectionClient<T>