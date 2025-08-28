import makeDebug from "@fetch-monorepo/debugging";
import { Plugin } from "@fetch-monorepo/fetch";
import CachePolicy from "http-cache-semantics";
import { LRUCache } from "lru-cache";

import { convert, replaceHeaders } from "./utils";

export const cachePlugin = (
  httpOpts: CachePolicy.Options,
  cacheOpts: CacheOptions,
  name = "http-cache",
): Plugin => {
  const debug = makeDebug(name);
  const cache = new LRUCache<CacheKey, CacheEntry>(cacheOpts);

  return () => {
    let cacheHit = false;

    return {
      preFetch(req) {
        const { policy, res } = cache.get(req.url) ?? {};

        if (res && policy?.satisfiesWithoutRevalidation(convert(req))) {
          debug("cache hit");
          cacheHit = true;

          return replaceHeaders(res, policy.responseHeaders());
        } else debug("cache miss");
      },

      postFetch(res, req) {
        if (!cacheHit) {
          const policy = new CachePolicy(convert(req), convert(res), httpOpts);

          if (policy.storable()) {
            cache.set(req.url, { policy, res }, { ttl: policy.timeToLive() });
            debug("cache stored");
          }
        }

        return res.clone();
      },
    };
  };
};

type CacheKey = string;
type CacheEntry = { policy: CachePolicy; res: Response };
type CacheOptions = LRUCache.Options<CacheKey, CacheEntry, unknown>;
