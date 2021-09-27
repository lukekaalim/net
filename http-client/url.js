// @flow strict

export const createURL = (query/*: { [string]: string }*/, path/*: string*/, baseURL/*: string*/)/*: URL*/ => {

  const queryEntries = Object.entries(query)
    .map(([p, v]) => typeof v === 'string' ? [p, v] : null)
    .filter(Boolean);

  const searchParams = new URLSearchParams(queryEntries);
  const url = new URL(path, baseURL);
  url.search = searchParams.toString();

  return url;
};
