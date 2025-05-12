import type { Plugin } from "fetch";

export const intercept = (
  { url, method }: Match = {},
  generator: Generator,
): Plugin => ({
  onEarlyResponse: (req) => {
    if (url && url === req.url && method && method === req.method) {
      return generator(req);
    }
  },
});

type Match = {
  url?: string;
  path?: string;
  method?: string;
};

type Generator = (req: Request) => Response;
