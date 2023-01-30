// @flow strict

/*::
declare module "ws" {
  import type { Server, IncomingMessage } from 'http';
  import type { Server as SServer, IncomingMessage as SIncomingMessage } from 'https';

  declare type WebSocketServerOptions = {

  } & (
    | {| port: number |}
    | {| server: Server | SServer |}
    | {| noServer: boolean |}
  )
  declare type WebSocketOptions = {
    origin?: string,
  }

  declare type WebSocketSendOptions = {
    binary?: boolean,
    compress?: boolean,
    fin?: boolean,
    mask?: boolean,
  }

  declare export class WebSocketServer {
    constructor(options: WebSocketServerOptions): WebSocketServer;
    addListener('connection', cb: (w: WebSocket, i: IncomingMessage | SIncomingMessage) => void): void;
    address(): { port: number, family: string, address: string };
    close(): void;
  }

  declare export class WebSocket {
    constructor(address: string | URL, protocols?: string[], options?: WebSocketOptions): WebSocket;

    addEventListener('message', cb: (event: MessageEvent & { data: Buffer | Buffer[], isBinary: boolean }) => mixed): void;
    addEventListener('ping', cb: ({ data: Uint8Array }) => mixed): void;
    addEventListener('error', cb: ({ code: number }) => mixed): void;
    addEventListener('pong', cb: ({ data: Uint8Array }) => mixed): void;
    addEventListener('open', cb: (event: Event) => mixed): void;
    addEventListener('close', cb: (event: CloseEvent) => mixed): void;
    removeEventListener('message', cb: ({ data: Uint8Array, isBinary: boolean }) => mixed): void;
    removeEventListener('open', cb: ({ data: Uint8Array, isBinary: boolean }) => mixed): void;
    removeEventListener('close', cb: ({ data: Uint8Array, isBinary: boolean }) => mixed): void;
    removeEventListener('error', cb: ({ code: number }) => mixed): void;
    
    close(code: number, reason: string): void;
    send(data: string | Uint8Array, options?: WebSocketSendOptions, cb?: (error?: Error) => void): void;
    +readyState: number,
  }
}
*/