import { Fetch, FetchArgs, Plugin, ResponseType, TypedResponse } from "./types";

export const applyPlugins =
  <Plugins extends Plugin[], Res = ResponseType<Plugins>>(
    fetch: Fetch,
    ...plugins: Plugins
  ) =>
  async (...args: FetchArgs): Promise<TypedResponse<Res>> => {
    const appliedFetch = applyPlugins<Plugins, Res>(fetch, ...plugins);
    const instances = plugins.map((p) => p());

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

      for (const fn of getFns("postFetch")) {
        const reqRes = await fn(res, req);

        res =
          reqRes instanceof Request
            ? await appliedFetch(reqRes)
            : (reqRes ?? res);
      }

      return res;
    } catch (err) {
      let reqRes: Request | Response | void = void 0;

      for (const fn of getFns("onError"))
        reqRes = reqRes ?? (await fn(err, req));

      if (!reqRes) throw err;

      return reqRes instanceof Request ? appliedFetch(reqRes) : reqRes;
    }
  };

type PluginInstance<ResBody = unknown> = ReturnType<Plugin<ResBody>>;
