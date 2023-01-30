import { createSocketFromDOM, createJSONWebSocketClient, ConnectionSocket } from '@lukekaalim/ws-client'

import { hauntedHouseConnectionDescription, HauntedHouseConnection } from '../hauntedHouseConnection.js';

const main = async () => {
  const client = createJSONWebSocketClient(
    (url) => createSocketFromDOM(new WebSocket(url)),
    hauntedHouseConnectionDescription,
    'ws://127.0.0.1:57037'
  )

  let socket: null | ConnectionSocket<HauntedHouseConnection> = null;

  const name = document.createElement('input');
  name.type = 'text';
  name.placeholder = "Name";

  const join = document.createElement('button');
  join.textContent = 'Join'
  join.addEventListener('click', () => {
    socket = client.connect({ name: name.value })
    socket.message.subscribe(({ data }) => log.textContent += data + '\n')
  })
  const leave = document.createElement('button');
  leave.textContent = 'Leave';
  leave.addEventListener('click', () => {
    if (socket)
      socket.close(1000, "Goodbye!")
  })
  const speak = document.createElement('button');
  speak.textContent = 'Speak';
  speak.addEventListener('click', () => {
    if (socket)
      socket.send("h- h- hello?");
  })
  const log = document.createElement('pre');

  document.body.append(name, join, leave, speak, log);
};

main();