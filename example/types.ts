import { createJSONWebSocketClient, createSocketFromWS } from "@lukekaalim/ws-client";
import { createJSONConnectionRoute, createWebSocketListener } from "@lukekaalim/ws-server";
import WebSocket, { WebSocketServer } from "ws";
import { HauntedHouseConnection, hauntedHouseConnectionDescription } from "./hauntedHouseConnection.js";

const server = new WebSocketServer({ port: 0 });
const getPort = (server: WebSocketServer) => {
  const address = server.address();
  if (typeof address === 'string')
    throw new Error('why is the address a string?');
  return address.port;
}
const port = getPort(server);
const actualAddress = `ws://127.0.0.1:${port}`;

const indexRoute = createJSONConnectionRoute(hauntedHouseConnectionDescription, connection => {
  console.log(`Welcome, ${connection.query.name}, to the SPOOOKY HOUSE`);

  connection.recievePublisher.subscribe((event) => {
    console.log(`${connection.query.name} says: "${event}"`);
    console.log('Giving a spooky reply!');
    const spookyResponses: HauntedHouseConnection["server"][] = [
      'haha',
      'bwahaha',
      'mwahahaha'
    ];
    connection.send(spookyResponses[Math.floor(Math.random() * 3)]);
  });

  connection.socket.addEventListener('close', ({ code, reason }) => {
    console.log(`Looks like ${connection.query.name} ran away! I think I heard them say "${reason}" as they were going.`)
    //server.close();
  })
});

server.addListener('connection', createWebSocketListener([
  indexRoute,
]));

server.addListener('listening', () => {
  const client = createJSONWebSocketClient(
    (url, protocols) => createSocketFromWS(new WebSocket(url, protocols)),
    hauntedHouseConnectionDescription,
    actualAddress,
  );
  console.log(`connecting to ${actualAddress}`)
  const socket = client.connect({ name: 'georgie' });
  socket.send('h- h- hello?')
  socket.message.subscribe(({ data }) => {
    console.log(`I- I- I- heard something! It sounded like someone saying: "${data}"`);
    console.log(`I'm getting out of here!`);
    socket.close(1001, "This house is haunted!");
  });
});
