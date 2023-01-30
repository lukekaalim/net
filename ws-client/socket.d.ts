import type { EventPublisher, Publisher } from "./publisher";
import type { WebSocket as WSWebSocket } from 'ws';

export interface IEvent {

}
export interface IMessageEvent extends IEvent {
  data: unknown
}
export interface ICloseEvent extends IEvent {
  reason: string,
  code: number
}

export interface ISocket {
  send(message: string): unknown,
  close(code: number, reason: string): unknown,

  openPublisher: Publisher<IEvent>,
  closePublisher: Publisher<ICloseEvent>,
  messagePublisher: Publisher<IMessageEvent>,
  errorPublisher: Publisher<IEvent>,
}

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

export const createSocketFromDOM: (websocket: WebSocket) => ISocket;
export const createSocketFromWS: (wsWebsocket: WSWebSocket) => ISocket;
export const createFakeSocket: (url: string, subprotocols: string[]) => { socket: ISocket, controller: FakeSocketController };