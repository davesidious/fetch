import type CachePolicy from "http-cache-semantics";

export const convert = <T extends Request | Response>(
  thing: T,
): T extends Request ? CachePolicy.Request : CachePolicy.Response => {
  const headers = Object.fromEntries(thing.headers.entries());

  return { ...thing, headers };
};

export const replaceHeaders = (res: Response, headers: CachePolicy.Headers) => {
  res.headers.forEach((_, k) => res.headers.delete(k));

  Object.entries(headers).forEach(
    ([k, v]) => v && toArray(v).forEach((v) => res.headers.append(k, v)),
  );

  return res;
};

const toArray = <T>(thing: T[] | T): T[] =>
  Array.isArray(thing) ? thing : [thing];
