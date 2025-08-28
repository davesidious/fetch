import type { Plugin } from "@davesidious/fetch";
import UrlPattern from "url-pattern";

export const intercept =
  (match: Match, generator: Generator): Plugin =>
  () => ({
    preFetch(req) {
      if (matchRequest(req, match)) return generator(req);
    },
  });

const matchRequest = (req: Request, match: Match) =>
  (match.count === undefined || match.count-- > 0) &&
  (match.method === undefined || match.method === req.method) &&
  (match.url === undefined || new UrlPattern(match.url).match(req.url));

export type Match = {
  count?: number;
  url?: string;
  method?: string;
};

type Generator = (req: Request) => Promise<Response | void> | Response | void;
