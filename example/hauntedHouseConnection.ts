import { c } from "@lukekaalim/cast";
import { ConnectionDescription } from "@lukekaalim/net-description";

export type HauntedHouseConnection = {
  query: { name: string },
  server: 'haha' | 'bwahaha' | 'mwahahaha',
  client: 'h- h- hello?'
};

export const hauntedHouseConnectionDescription: ConnectionDescription<HauntedHouseConnection> = {
  path: '/',
  castClientMessage: c.lit('h- h- hello?'),
  castServerMessage: c.enums(['haha', 'bwahaha', 'mwahahaha']),
  castQuery: c.obj({ name: c.str })
}
