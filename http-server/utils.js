// @flow strict
/*:: import type { Server } from 'http'; */

export const listenServer = async (
  server/*: Server*/,
  port/*: number*/ = 0,
  host/*: string*/ = 'localhost'
)/*: Promise<{ host: string, httpOrigin: string, wsOrigin: string }>*/ => {
  return new Promise(res => {
    server.listen(port, host, () => {
      const { address, port } = server.address();
      const host = `${address}:${port}`;
      const httpOrigin = `http://${host}`;
      const wsOrigin = `ws://${host}`;
      res({ host, httpOrigin, wsOrigin });
    });
  });
};