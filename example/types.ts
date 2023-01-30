import { c } from "@lukekaalim/cast";
import { ConnectionDescription } from "@lukekaalim/net-description";
import { createJSONWebSocketClient, createSocketFromWS } from "@lukekaalim/ws-client";
import WebSocket from "ws";

type MyConnection = {
  query: { name: string },
  server: 'haha' | 'bwahaha' | 'mwahahaha',
  client: 'h- h- hello?'
};

const description: ConnectionDescription<MyConnection> = {
  path: '/',
  castClientMessage: c.lit('h- h- hello?'),
  castServerMessage: c.enums(['haha', 'bwahaha', 'mwahahaha']),
}

const client = createJSONWebSocketClient(
  (url, protocols) => createSocketFromWS(new WebSocket(url, protocols)),
  description,
  'www.com'
)

const socket = client.connect({ name: 'georgie' });

socket.send('h- h- hello?')

socket.close(1001, "Off time!");
