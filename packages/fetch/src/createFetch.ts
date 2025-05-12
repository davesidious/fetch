import { Plugin, FetchArgs, TypedResponse, ResponseShape } from "./types";

export const createFetch = <
  Plugins extends Plugin[],
  Res = ResponseShape<Plugins>,
>(
  ...plugins: Plugins
) => {
  const getFns = <Fn extends keyof Plugin<Res>>(fn: Fn) =>
    plugins
      .filter((p): p is Required<Plugin<Res>> => fn in p)
      .map((p) => p[fn]);

  return async (...args: FetchArgs): Promise<TypedResponse<Res>> => {
    let req = new Request(...args);
    let earlyRes: Response | void = void 0;

    for (const fn of getFns("onRequest")) req = req || (await fn(req));
    for (const fn of getFns("onEarlyResponse"))
      earlyRes = earlyRes ?? (await fn(req));

    try {
      let res = earlyRes ?? fetch(req);

      for (const fn of getFns("onResponse")) res = fn(await res, req);

      return res;
    } catch (err) {
      let req: Request | void = void 0;

      for (const fn of getFns("onError")) req = req ?? (await fn(err));

      if (!req) throw err;

      return createFetch<Plugins, Res>(...plugins)(req);
    }
  };
};
