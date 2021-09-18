# @lukekaalim/server

Library for building simple servers.

## Installation
```bash
npm i @lukekaalim/server
```

## Usage

This server will return "Hello World" on port 8080 when requesting "/greetings", and 404 on all other responses.
```js
const { text, route, router } = require('@lukekaalim/server');
const { createServer } = require('http');

const main = () => {
  const myRoute = route(
    'GET',
    '/greetings',
    () => text.plain(200, 'Hello World!')
  );
  const myRouter = router([myRoute]);
  const myServer = createServer(myRouter);

  myServer.listen(8080);
};

main();
```