// @flow strict

import { createEventPublisher } from "./publisher";

/*::
import type { EventPublisher, Publisher } from "./publisher";
import type { WebSocket as WSWebSocket } from 'ws';

export interface IEvent {

}
export interface IMessageEvent extends IEvent {
  data: mixed
}
export interface ICloseEvent extends IEvent {
  reason: string,
  code: number
}

export interface ISocket {
  send(message: string): mixed,
  close(code: number, reason: string): mixed,

  openPublisher: Publisher<IEvent>,
  closePublisher: Publisher<ICloseEvent>,
  messagePublisher: Publisher<IMessageEvent>,
  errorPublisher: Publisher<IEvent>,
}
*/

const createSendQueue = (realSend/*: string => mixed*/, onOpenPublisher/*: Publisher<IEvent>*/) => {
  let isOpen = false
  const queue = [];
  const send = (data/*: string*/) => {
    if (isOpen)
      realSend(data);
    else
      queue.push(data);
  };
  onOpenPublisher.subscribe(() => {
    isOpen = true;
    for (const data of queue)
      realSend(data);
  });
  return send;
}

// As in, the global DOM object, WebSocket. When your a webpage.
export const createSocketFromDOM = (
  websocket/*: WebSocket*/
)/*: ISocket*/ => {
  // Publishers
  const messagePublisher = createEventPublisher();
  const openPublisher = createEventPublisher();
  const closePublisher = createEventPublisher();
  const errorPublisher = createEventPublisher();

  // Event Handlers
  websocket.onmessage = async (event/*: MessageEvent*/) => {
    messagePublisher.publish({ data: event.data });
  };
  websocket.onerror = () => {
    errorPublisher.publish({})
  }
  websocket.onclose = (event/*: CloseEvent*/) => {
    closePublisher.publish({ code: event.code, reason: event.reason })
  };
  websocket.onopen = () => {
    openPublisher.publish({})
  }

  // Socket actions
  const send = createSendQueue(s => websocket.send(s), openPublisher);
  const close = (code/*: number*/, reason/*: string*/) => {
    websocket.close(code, reason);
  }

  return { send, close, messagePublisher, closePublisher, errorPublisher, openPublisher }
}

// As in, the WS npm library
export const createSocketFromWS = (
  websocket/*: WSWebSocket*/
)/*: ISocket*/ => {
  // Publishers
  const messagePublisher = createEventPublisher();
  const openPublisher = createEventPublisher();
  const closePublisher = createEventPublisher();
  const errorPublisher = createEventPublisher();

  // Attach event handlers
  websocket.addEventListener('message', async (event/*: MessageEvent*/) => {
    messagePublisher.publish({ data: event.data });
  });
  websocket.addEventListener('error', (event/*: { code: number }*/) => {
    errorPublisher.publish({})
  });
  websocket.addEventListener('close', (event/*: CloseEvent*/) => {
    closePublisher.publish({ code: event.code, reason: event.reason })
  });
  websocket.addEventListener('open', () => {
    openPublisher.publish({})
  });

  // Socket actions
  const send = createSendQueue(s => websocket.send(s), openPublisher);
  const close = (code/*: number*/, reason/*: string*/) => {
    websocket.close(code, reason);
  }

  return { send, close, messagePublisher, closePublisher, errorPublisher, openPublisher }
}

/*::
export type FakeSocketController = {
  url: string,
  subprotocols: string[],

  clientMessage: EventPublisher<string>,
  clientClose: EventPublisher<ICloseEvent>,

  message: EventPublisher<IMessageEvent>,
  open: EventPublisher<IEvent>,
  close: EventPublisher<ICloseEvent>,
  error: EventPublisher<IEvent>,
};
*/

export const createFakeSocket = (
  url/*: string*/,
  subprotocols/*: string[]*/
)/*: { socket: ISocket, controller: FakeSocketController }*/ => {
  const controller = {
    url,
    subprotocols,
    clientMessage: createEventPublisher(),
    clientClose: createEventPublisher(),

    message: createEventPublisher(),
    open: createEventPublisher(),
    close: createEventPublisher(),
    error: createEventPublisher(),
  };

  const socket = {
    send: (data/*: string*/) => controller.clientMessage.publish(data),
    close: (code/*: number*/, reason/*: string*/) => controller.clientClose.publish({ code, reason }),

    messagePublisher: controller.message,
    openPublisher: controller.open,
    closePublisher: controller.close,
    errorPublisher: controller.error,
  }
  
  return {
    socket,
    controller,
  };
}