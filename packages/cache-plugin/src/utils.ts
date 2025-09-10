import type CachePolicy from "http-cache-semantics";

export const convert = <T extends Request | Response>(
  thing: T,
): T extends Request ? CachePolicy.Request : CachePolicy.Response => {
  const headers = Object.fromEntries(thing.headers.entries());

  return { ...thing, headers };
};

export const replaceHeaders = (res: Response, headers: CachePolicy.Headers) => {
  for (const h of res.headers.keys()) res.headers.delete(h);

  for (const h in headers)
    toArray(headers[h]).forEach((v) => is(v) && res.headers.append(h, v));

  return res;
};

const is = <T>(thing: T | undefined): thing is T => thing !== undefined;

const toArray = <T>(thing: T[] | T): T[] =>
  Array.isArray(thing) ? thing : [thing];
