import { Plugin } from "@davesidious/fetch";

export const loggerPlugin =
  (onRequest: OnRequest): Plugin =>
  () => {
    let start: number;

    function preFetch() {
      start = Date.now();
    }

    async function postFetch(res: Response, req: Request) {
      await onRequest(req, res, Date.now() - start);
    }

    return { preFetch, postFetch };
  };

type OnRequest = (
  req: Request,
  res: Response,
  duration: number,
) => void | Promise<void>;
