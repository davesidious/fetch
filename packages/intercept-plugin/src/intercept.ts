import type { Plugin } from "fetch";

export const intercept =
  (match: Match, generator: Generator): Plugin =>
  () => ({
    preFetch: (req) => (matchRequest(req, match) ? generator(req) : void 0),
  });

const matchRequest = (req: Request, match: Match) =>
  (match.count === undefined || match.count-- > 0) &&
  (match.url === undefined || match.url === req.url) &&
  (match.path === undefined || match.path === new URL(req.url).pathname) &&
  (match.method === undefined || match.method === req.method);

export type Match = {
  count?: number;
  url?: string;
  path?: string;
  method?: string;
};

type Generator = (req: Request) => Promise<Response | void> | Response | void;
