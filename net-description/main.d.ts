import { Cast } from '@lukekaalim/cast';

export type ConnectionTypeTriplet = {
  query: any,
  server: any,
  client: any,
}

export type ConnectionDescription<T extends ConnectionTypeTriplet> = {
  path: string,
  subprotocol?: string,

  castQuery?:         Cast<T['query']>,
  castServerMessage?: Cast<T['server']>,
  castClientMessage?: Cast<T['client']>,
}
