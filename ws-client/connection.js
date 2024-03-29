// @flow strict
/*::
import type { IMessageEvent, ISocket } from "./socket";
import type { ConnectionDescription, Connection } from '@lukekaalim/net-description';
*/
import { getMessageDataString } from "./data.js";
import { createEventPublisher } from "@lukekaalim/net-common";

/*::
export type Publisher<T> = {
  subscribe: (subscriber: (payload: T) => mixed) => { unsubscribe: () => void },
};

export type ConnectionSocket<T: Connection<>> = {
  socket: ISocket,

  send: (message: T["client"]) => void,
  close: (code: number, reason: string) => void,
  message: Publisher<{ data: T["server"] }>,
}

export type ConnectionClient<T: Connection<>> = {
  connect: (query: T["query"]) => ConnectionSocket<T>,
};
*/

export const createJSONWebSocketClient = /*:: <T: Connection<>>*/(
  createSocket/*: (url: string, subprotocols?: string[]) => ISocket*/,
  description/*: ConnectionDescription<T>*/,
  baseURL/*: URL | string*/,
)/*: ConnectionClient<T>*/ => {
  const {
    castServerMessage,
  } = description;

  const connect = (query/*: T["query"]*/) => {
    const message = createEventPublisher();

    const url = new URL(description.path, baseURL);
    url.search = new URLSearchParams(query).toString();

    const socket = createSocket(url.href, [description.subprotocol].filter(Boolean));
    socket.messagePublisher.subscribe(async (event/*: IMessageEvent*/) => {
      try {
        if (!castServerMessage)
          return;
        const dataString = await getMessageDataString(event);
        const data = castServerMessage(JSON.parse(dataString));
        message.publish({ data });
      } catch (error) {
        console.error(error);
      }
    });

    const send = (message/*: T["client"]*/) => {
      const data = JSON.stringify(message);
      socket.send(data);
    };
    const close = (code/*: number*/, reason/*: string*/) => {
      socket.close(code, reason);
    }

    return {
      send,
      close,

      message,
      socket,
    };
  };

  return {
    connect,
  };
};
