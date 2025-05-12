export type FetchArgs = Parameters<(typeof globalThis)["fetch"]>;

export type ResponseShape<Plugins> = Plugins extends [Plugin<infer Body>]
  ? Body
  : Plugins extends [Plugin<infer Body>, ...infer Rest]
    ? Body & ResponseShape<Rest>
    : never;

export type TypedResponse<Body = unknown> = Omit<Response, "json"> & {
  json: () => Promise<Body>;
};

export interface Plugin<ResBody = unknown> {
  onRequest?: (req: Request) => Request;
  onEarlyResponse?: (
    req: Request,
  ) => Promise<TypedResponse<ResBody> | void> | TypedResponse<ResBody> | void;
  onResponse?: (
    res: TypedResponse<unknown>,
    req: Request,
  ) => TypedResponse<ResBody> | Promise<TypedResponse<ResBody>>;
  /**
   *
   * @param err The caught error
   * @returns a TypedResponse to return from the fetch call, or void to pass
   *  to the next error handler.
   *
   *  If no error handler returns a response, the original error is thrown.
   */
  onError?: (
    err: unknown,
  ) => Promise<TypedResponse<ResBody> | void> | TypedResponse<ResBody> | void;
}
