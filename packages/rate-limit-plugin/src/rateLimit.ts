import { Plugin } from "@davesidious/fetch";
import parseRetryAfter from "parse-retry-after";

/**
 * @todo get a better name!
 */
export const rateLimitPlugin =
  (onLimit?: (retryAfter: number) => void): Plugin =>
  (fetch) => {
    return {
      async postFetch(res, req) {
        if (res.status !== 429) return;

        const retryAfter = res.headers.has("retry-after")
          ? parseRetryAfter(res)
          : 30;

        onLimit?.(retryAfter);

        return new Promise((r) => {
          setTimeout(() => r(fetch(req.clone())), retryAfter * 1000);
        });

        // await new Promise((r) => setTimeout(r, retryAfter * 1000));

        // return fetch(req.clone());
      },
    };
  };
