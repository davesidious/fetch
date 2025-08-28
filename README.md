# `fetch` with plugins

> [!CAUTION]
> This repository is currently a work in progress.  Use at your own peril!

## Introduction

This repository aims to provide a method of creating a `fetch()` function which has baked-in behaviour defined by one or more plugins.

Plugins can affect how a request is made or how a response is handled, and can even type a response's JSON body.

Each created `fetch()` function will have the _exact_ same interface as the built-in `fetch()` function, allowing drop-in use.

## The most basic example

This example shows how to replace the original `Request` object with one of your own creation.

```ts
  import { usePlugins, Plugin } from "@davesidious/fetch";

  const plugin: Plugin = (newUrl: string) => () => ({
    onRequest: (req) => new Request(newUrl, req),
  });

  // myFetch() will rewrite all requested URLs to http://new/
  const myFetch = usePlugins(plugin("http://new/"));
```