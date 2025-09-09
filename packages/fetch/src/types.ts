export type Plugin<ResBody = unknown> = () => {
  /**
   * Allows a plugin to modify or replace the `Request` object passed to `fetch`.
   *
   * @param req The request to be modified or replaced
   * @returns A `Request` object
   */
  onRequest?: (req: Request) => Awaitable<Request>;

  /**
   * Allows a plugin to return a response, skipping the actual call to `fetch`.
   *
   * @param req The initiating `Request`
   * @returns A response or void
   */
  preFetch?: (req: Request) => Awaitable<TypedResponse | void>;

  /**
   * Allows a plugin to modify or replace the received response.
   *
   * @param res The response
   * @param req The initiating request
   * @returns A Request to be re-fetched by the same plugins, or a Response.
   */
  postFetch?: (
    res: Response,
    req: Request,
  ) => Awaitable<TypedResponse<ResBody> | Request | void>;

  /**
   * Called after the final response has been calculated
   *
   * @param req The final request
   * @param res The final response
   * @returns A void or Promise<void>.
   */
  onFinish?: (req: Request, res: Response) => Awaitable<void>;

  /**
   * Defines an error handler. If no error handler returns a new request,
   * the original error is thrown.
   *
   * @param err The caught error
   * @param req The initiating request
   * @returns a Request to be re-fetched by the same plugins or void to pass
   * to the next error handler.
   */
  onError?: (err: unknown, req: Request) => Awaitable<Request | void>;
};

export type Fetch = (typeof globalThis)["fetch"];
export type FetchArgs = Parameters<Fetch>;

export type ResponseType<Plugins> = Plugins extends [Plugin<infer Body>]
  ? Body
  : Plugins extends [Plugin<infer Body>, ...infer Rest]
    ? Body & ResponseType<Rest>
    : never;

export type TypedResponse<Body = unknown> = Omit<Response, "json"> & {
  json: () => Promise<Body>;
};

type Awaitable<T> = Promise<T> | T;
