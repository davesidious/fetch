import { Fetch, FetchArgs, Plugin, ResponseType, TypedResponse } from "./types";

export const applyPlugins =
  <Plugins extends Plugin[], Res = ResponseType<Plugins>>(
    fetch: Fetch,
    ...plugins: Plugins
  ) =>
  async (...args: FetchArgs): Promise<TypedResponse<Res>> => {
    const appliedFetch = applyPlugins<Plugins, Res>(fetch, ...plugins);
    const instances = plugins.map((p) => p(appliedFetch));

    const getFns = <Fn extends keyof PluginInstance>(fn: Fn) =>
      instances
        .filter((p): p is Required<PluginInstance<Res>> => fn in p)
        .map((p) => p[fn]);

    let req = new Request(...args);
    let earlyRes: TypedResponse | void = void 0;

    for (const fn of getFns("onRequest")) req = await fn(req.clone());
    for (const fn of getFns("preFetch"))
      earlyRes = earlyRes ?? (await fn(req.clone()));

    try {
      let res: TypedResponse<Res> = earlyRes ?? (await fetch(req.clone()));

      for (const fn of getFns("postFetch")) res = (await fn(res, req)) ?? res;

      return res;
    } catch (err) {
      let errReq: Request | void = void 0;

      for (const fn of getFns("onError"))
        errReq = errReq ?? (await fn(err, req));

      if (!errReq) throw err;

      return appliedFetch(errReq);
    }
  };

type PluginInstance<ResBody = unknown> = ReturnType<Plugin<ResBody>>;
