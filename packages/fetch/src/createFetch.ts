import { Plugin, FetchArgs, TypedResponse, ResponseShape } from "./types";

export const createFetch =
  <Plugins extends Plugin[]>(...plugins: Plugins) =>
  (...args: FetchArgs): Promise<TypedResponse<ResponseShape<Plugins>>> => {
    const req = new Request(...args);

    const finalReq = plugins
      .filter((p) => "onRequest" in p)
      .reduce((req, p) => p.onRequest(req), req);

    const earlyResponse = plugins
      .filter((p) => "onEarlyResponse" in p)
      .reduce<Promise<
        TypedResponse<unknown>
      > | void>((res, p) => res || p.onEarlyResponse(req), undefined);

    const resPromise = earlyResponse || fetch(finalReq);

    return plugins
      .filter((p) => "onResponse" in p)
      .reduce((resPromise, p) => {
        return Promise.resolve(p.onResponse(resPromise, req));
      }, resPromise);
  };
