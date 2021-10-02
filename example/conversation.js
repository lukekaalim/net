// @flow strict
/*:: import type { Connection, ConnectionDescription } from '@lukekaalim/net-description'; */
/*:: import type { IncomingMessage } from "http"; */
/*:: import type { IncomingMessage as SIncomingMessage } from "https"; */
import { createFixedListener, listenServer } from "@lukekaalim/http-server";
import { createObjectCaster, castString, createConstantCaster, createKeyedUnionCaster } from '@lukekaalim/cast';

import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { createWebSocketListener, createJSONConnectionRoute } from '@lukekaalim/ws-server';
import { createJSONConnectionClient } from '@lukekaalim/ws-client';

/*::
export type ChatMessage = {|
  type: 'chat',
  user: string,
  content: string,
|};
export type SpecialBroadcast = {|
  type: 'broadcast',
  content: string
|};

export type ChatRoomConnection = Connection<ChatMessage | SpecialBroadcast, ChatMessage, { chatRoomId: string, name: string }>;
*/

const chatRoomConnectionDescription/*: ConnectionDescription<ChatRoomConnection>*/ = {
  path: '/chat-room',
  castQuery: createObjectCaster({ chatRoomId: castString, name: castString }),

  castServerMessage: createKeyedUnionCaster('type', {
    'chat': createObjectCaster({ type: createConstantCaster('chat'), user: castString, content: castString }),
    'broadcast': createObjectCaster({ type: createConstantCaster('chat'), content: castString }),
  }),
  castClientMessage: createObjectCaster({ type: createConstantCaster('chat'), user: castString, content: castString }),
};

const createChatRoomServer = () => {
  const httpListener = createFixedListener({ status: 101, headers: {}, body: null })
  const httpServer = createServer(httpListener);

  const connections = new Set()

  const route = createJSONConnectionRoute(chatRoomConnectionDescription, (connection, socket) => {
    connections.add(connection);

    const { addRecieveListener, send, query: { name, chatRoomId } } = connection;

    send({ type: 'broadcast', content: `Welcome to room ${chatRoomId}, ${name}` });
    addRecieveListener((message) => {
      for (const con of [...connections].filter(con => con !== connection))
        con.send(message);
    })
    socket.addEventListener('close', () => void [...connections]
      .map(c => c.send({ type: 'broadcast', content: `${name} has left the room.` })));
  });

  const socketServer = new WebSocketServer({ server: httpServer });
  const socketListener = createWebSocketListener([route]);
  socketServer.addListener('connection', socketListener);

  return [socketServer, httpServer];
};

const createChatRoomClient = async (baseURL, roomId, user) => {
  const client = createJSONConnectionClient(WebSocket, chatRoomConnectionDescription, baseURL);
  
  const recieve = (message) => {
    switch (message.type) {
      case 'broadcast':
        return console.log(`${user} hears a broadcast:`, message.content);
      case 'chat':
        return console.log(`${user} hears ${message.user} say:`, message.content);
    }
  };

  const { send, close } = await client.connect({ query: { chatRoomId: roomId, name: user }, recieve });

  const sendMessage = (content) => {
    send({ type: 'chat', content, user });
  };

  return {
    close,
    sendMessage,
  };
}


const main = async () => {
  const [wsServer,httpServer] = createChatRoomServer();
  const { wsOrigin } = await listenServer(httpServer, 0, 'localhost');
  const lukeClient = await createChatRoomClient(wsOrigin, '199', 'luke');
  const talaClient = await createChatRoomClient(wsOrigin, '199', 'tala');
  try {
    lukeClient.sendMessage('Hello all!');
    lukeClient.sendMessage('How are you doing?');
    talaClient.sendMessage('I am well!');

    await new Promise(r => setTimeout(r, 0));
  } finally {
    // this only works becaus tala closes first - this gives luke time to hear her message
    // in reality, you shouldn't synchronously open/close sockets while expecting messages
    await talaClient.close();
    await new Promise(r => setTimeout(r, 0));
    await lukeClient.close();

    httpServer.close();
    wsServer.close();
  }
};

main();