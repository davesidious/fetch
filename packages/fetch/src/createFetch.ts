import { Plugin, FetchArgs, TypedResponse, ResponseShape } from "./types";

export const createFetch = <
  Plugins extends Plugin[],
  Res extends TypedResponse = TypedResponse<ResponseShape<Plugins>>,
>(
  ...plugins: Plugins
) => {
  const getFns = <Fn extends keyof Plugin>(fn: Fn): Plugin[Fn][] =>
    plugins.filter((p) => fn in p).map((p) => p[fn]);

  return (...args: FetchArgs): Promise<Res> => {
    const req = getFns("onRequest").reduce(
      (req, p) => p(req),
      new Request(...args),
    );

    const earlyResponse: Promise<Res> = getFns("onEarlyResponse").reduce(
      (res, p) => res.then((res) => res || Promise.resolve(p(req))),
      Promise.resolve(undefined),
    );

    const res = earlyResponse.then((res) => res || fetch(req));

    return getFns("onResponse")
      .reduce((res, p) => res.then((res) => p(res, req)), res)
      .catch((err) =>
        getFns("onError")
          .reduce(
            (res, p) => res.then((res) => res || Promise.resolve(p(err))),
            Promise.resolve(undefined),
          )
          .then((res) => res || Promise.reject(err)),
      );
  };
};
