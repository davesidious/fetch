import { Plugin } from "@davesidious/fetch";
import parseRetryAfter from "parse-retry-after";

/**
 * @todo get a better name!
 */
export const rateLimitPlugin =
  (onLimit?: (retryAfter: number) => void): Plugin =>
  () => {
    return {
      async postFetch(res, req) {
        if (res.status !== 429) return;

        const retryAfter = res.headers.has("retry-after")
          ? parseRetryAfter(res)
          : 30;

        onLimit?.(retryAfter);
        const reqClone = req.clone();

        return new Promise((r) => {
          setTimeout(() => r(reqClone), retryAfter * 1000);
        });
      },
    };
  };
