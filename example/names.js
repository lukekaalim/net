// @flow strict
/*:: import type { ResourceDescription } from '@lukekaalim/net-description';*/
import { createJSONResourceRoutes, createRouteListener, listenServer, getAuthorization } from '@lukekaalim/http-server';
import { createJSONResourceClient, createNodeClient, createAuthorizedClient } from '@lukekaalim/http-client';
import { request, createServer } from 'http';
import { castString, createArrayCaster } from "@lukekaalim/cast";

/*::
export type NameAPI = {
  '/names': {|
    GET: { query: empty, response: $ReadOnlyArray<string>, request: empty },
    POST: { query: empty, response: $ReadOnlyArray<string>, request: string },
  |}
};
*/

export const namesDescription/*: ResourceDescription<NameAPI['/names']>*/ = {
  path: '/names',

  GET: {
    toResponseBody: createArrayCaster(castString),
  },
  POST: {
    toResponseBody: createArrayCaster(castString),
    toRequestBody: castString
  }
};

const createNamesServer = () => {
  const names = [];
  const token = Math.floor(Math.random() * 100).toString();
  
  const routes = createJSONResourceRoutes(namesDescription, {
    GET: async ({ headers }) => {
      console.log(headers);
      return { status: 200, body: names, headers: { howdy: 'friends' } };
    },
    POST: async ({ body: newName, headers }) => {
      const auth = getAuthorization(headers);
      if (!auth || auth.type !== 'bearer' || auth.token !== token)
        return { status: 401, body: [] };
      names.push(newName);
      return { status: 200, body: names };
    }
  });
  const listener = createRouteListener(routes);
  const server = createServer(listener);
  return { server, token };
}

const createNamesClient = (origin, token) => {
  const httpClient = createAuthorizedClient(createNodeClient(request), { type: 'bearer', token });
  const resource = createJSONResourceClient(namesDescription, httpClient, origin);
  
  const getAllNames = async () => {
    console.log(await httpClient.sendRequest({ method: 'HEAD', url: new URL('/names', origin), headers: {} }))
    const { body: names, headers } = await resource.GET({ headers: { hello: 'world' }});
    console.log(headers);
    return names;
  };
  const addName = async (newName) => {
    const { body: names } = await resource.POST({ body: newName });
    return names;
  };
  return { getAllNames, addName };
};


const main = async () => {
  const { server, token } = createNamesServer();
  const { httpOrigin } = await listenServer(server, 0, 'localhost');

  const client = createNamesClient(httpOrigin, token);
  console.log(httpOrigin);

  try {
    await client.addName('Luka');
    await client.addName('Merton');
    await client.addName('Antonio');
    await client.addName('Ka\' Aulim');
    console.log(await client.getAllNames());
  } catch (error) {
    console.error(error);
  } finally {
    server.close();
  }
}

main();