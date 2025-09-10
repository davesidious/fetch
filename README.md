# `fetch`, but extensible.

> [!WARNING]
> This repository is currently a work in progress.  Use at your own peril!

## Introduction

This repository aims to provide a method of creating a `fetch()` function which has baked-in behaviour defined by one or more plugins.

Plugins can affect how a request is made or how a response is handled, and can even type a response's JSON body.  They can make their own requests, return their own `Response` object (preventing a request hitting the network), 

Each created function will have the _exact_ same interface as the built-in `fetch()` function, allowing truly seamless use.

# Usage

## Creating an extended `fetch` function

You can create a `fetch`-compatible function by calling `applyPlugins`, and passing an existing `fetch` implementation, e.g. `globalThis.fetch`:

```ts
  import { applyPlugins } from "@davesidious/fetch";

  const extendedFetch = applyPlugins(globalThis.fetch, ...plugins);
```

Or if you _are_ into the whole brevity thing, use `usePlugins`, which is functionally identical, but assumes you want to use `globalThis.fetch`.

```ts
  import { usePlugins } from "@davesidious/fetch";

  const extendedFetch = usePlugins(...plugins);
```

## Plugins

Plugins are where this starts to get exciting.  A plugin is a function which returns an object with zero or more of the following functions:

### `onRequest`

* Type: `(req: Request) => Request | Promise<Request>`

`plugin.onRequest` provides the plugin with the opportunity to modify or replace the original `Request` object passed to `fetch` (or, if `fetch` was called with a string URL, a `Request` object created from the string).

### `preFetch`

* Type: `(req: Request) => void | Promise<Response | void>`

`plugin.preFetch` is called with the finalised `Request` object.  It can return a `Response`, which will cause all other `preFetch` methods on subsequent plugins to be skipped, and be used in the next method.

### `postFetch`

* Type: `(res: Response, req: Request) => Response | Request | void | Promise<Response | Request | void>`

`plugin.postFetch` is passed the response from the wrapped `fetch` function (or from a plugin, if one returned a `Response` from its `preFetch` method), and the finalised `Request` object.  It can return (either directly or via `Promise`):

* A request, which is then passed back to your extended fetch function
* A response, which is passed to the caller of your extended fetch function

### `onFinish`

* Type: `(req: Request, res: Response) => void | Promise<void>;`

`plugin.onFinish` is called after the request has been finalised and the response has been calculated.  Both are passed to this function, allowing for profiling or analytics to see the full request & response pair.

### `onError`

* Type: `(err: unknown, req: Request) => Request | void | Promise<Request | void>`

`plugin.onError` is called whenever an error occurs when making the request.  It can return (either directly or via `Promise`):

* A request, which is then passed back to your extended fetch function
* Nothing, in which case the next plugin's `onError` callback will be called

## Typing the response

A plugin can define the type of its JSON body:

```ts
  import { type Plugin, usePlugins } from "@davesidious/fetch";

  const plugin: Plugin<string> = () => ({
    async postFetch(res) {
      return typeof (await res.clone().json()) === "string";
    }
  });

  const extendedFetch = usePlugins(plugin);
  const res = await extendedFetch("http://host/path");
  const body: string = await res.json();
```

The calculated final type of the response body is created from an intersection type formed from the types specified by the plugins.  Using plugins with incompatible types will cause a TypeScript error.