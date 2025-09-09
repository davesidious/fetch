import { Plugin } from "@davesidious/fetch";

export const loggerPlugin =
  (onRequest: OnRequest): Plugin =>
  () => {
    let start: number;

    return {
      preFetch() {
        start = Date.now();
      },

      onFinish(req: Request, res: Response) {
        return onRequest(req, res, Date.now() - start);
      },
    };
  };

type OnRequest = (
  req: Request,
  res: Response,
  duration: number,
) => void | Promise<void>;
