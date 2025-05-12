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
  onEarlyResponse?: (req: Request) => Promise<TypedResponse<ResBody>> | void;
  onResponse?: (
    res: Promise<TypedResponse<unknown>>,
    req: Request,
  ) => TypedResponse<ResBody> | Promise<TypedResponse<ResBody>>;
}
