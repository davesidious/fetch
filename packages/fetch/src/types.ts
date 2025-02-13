export interface Plugin<ResBody = unknown> {
  /**
   * Allows a plugin to modify or replace the `Request` object passed to `fetch`.
   *
   * @param req The request to be modified or replaced
   * @returns A `Request` object
   */
  onRequest?: (req: Request) => Promise<Request> | Request;

  /**
   * Allows a plugin to return a response, skipping the actual call to `fetch`.
   *
   * @param req The initiating `Request`
   * @returns A response or void
   */
  onEarlyResponse?: (
    req: Request,
  ) => Promise<TypedResponse | void> | TypedResponse | void;

  /**
   * Allows a plugin to modify or replace the received response.
   *
   * @param res The response
   * @param req The initiating request
   * @returns A response
   */
  onResponse?: (
    res: Response,
    req: Request,
  ) => TypedResponse<ResBody> | Promise<TypedResponse<ResBody>>;

  /**
   * Defines an error handler. If no error handler returns a new request,
   * the original error is thrown.
   *
   * @param err The caught error
   * @returns a Request to be re-fetched by the same plugins, or void to pass
   *  to the next error handler.
   */
  onError?: (err: unknown) => Promise<Request | void> | Request | void;
}

export type FetchArgs = Parameters<(typeof globalThis)["fetch"]>;

export type ResponseShape<Plugins> = Plugins extends [Plugin<infer Body>]
  ? Body
  : Plugins extends [Plugin<infer Body>, ...infer Rest]
    ? Body & ResponseShape<Rest>
    : never;

export type TypedResponse<Body = never> = Omit<Response, "json"> & {
  json: () => Promise<Body>;
};
