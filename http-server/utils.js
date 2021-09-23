// @flow strict
/*:: import type { Server } from 'http'; */

export const listenServer = async (
  server/*: Server*/,
  port/*: number*/ = 0,
  host/*: string*/ = 'localhost'
)/*: Promise<{ origin: string }>*/ => {
  return new Promise(res => {
    server.listen(port, host, () => {
      const { address, port } = server.address();
      const origin = `http://${address}:${port}`;
      res({ origin });
    });
  });
};