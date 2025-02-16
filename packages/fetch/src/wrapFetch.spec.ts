import { afterAll, afterEach, beforeAll, describe, expect, it } from "testing";
import { http, HttpResponse, setupServer } from "testing/mockServer";

import { buildFetch } from "./buildFetch";
import { Plugin, TypedResponse } from "./types";

const server = setupServer(
  http.get("*", ({ request }) => HttpResponse.json({ url: request.url })),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const createTypedResponse = <B>(body: B): TypedResponse<B> =>
  new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
  });

it("supports rewriting requests", async () => {
  const newUrl = "http://new.invalid/";
  const plugin: Plugin = () => ({
    onRequest: (req) => new Request(newUrl, req),
  });

  const res = await buildFetch(plugin)("http://host.invalid");

  expect(await res.json()).toMatchObject({ url: newUrl });
});

it("supports multiple onResponse plugins, async and not", async () => {
  expect.assertions(3);

  const plugins = [
    () => ({
      postFetch: async (res: unknown) => {
        expect(res).toBeInstanceOf(Response);

        return createTypedResponse("first");
      },
    }),
    () => ({
      postFetch: (res: unknown) => {
        expect(res).toBeInstanceOf(Response);

        return createTypedResponse("second");
      },
    }),
    () => ({ postFetch: async () => createTypedResponse("third") }),
  ] as const;

  const res = await buildFetch(...plugins)("http://host.invalid");
  const body = await res.json();

  expect(body).toBe("third");
});

it("supports typing the response", async () => {
  const fetch = buildFetch(
    () => ({ postFetch: () => createTypedResponse(true) }),
    () => ({ postFetch: () => void 0 }),
  );
  const res = await fetch("http://host.invalid");
  const body = await res.json();

  expect(body).toBe(true);
});

it("supports returning early", async () => {
  const plugin = () => ({
    preFetch: () => createTypedResponse(true),
  });

  const res = await buildFetch(plugin)("http://host.invalid");
  const body = await res.json();

  expect(body).toBe(true);
});

describe("error handling", () => {
  it("supports returning a response when an error is caught", async () => {
    const plugin = () => ({
      onError: () => new Request("http://recovered.invalid"),
    });

    server.use(http.get("http://host.invalid", () => HttpResponse.error()));

    const res = await buildFetch(plugin)("http://host.invalid");

    expect(await res.json()).toMatchObject({
      url: "http://recovered.invalid/",
    });
  });

  it("supports not returning anything when an error is caught", async () => {
    const plugin: Plugin = () => ({
      onError: () => undefined,
    });

    server.use(http.get("*", () => HttpResponse.error()));

    await expect(() =>
      buildFetch(plugin)("http://host.invalid"),
    ).rejects.toThrowError("Failed to fetch");
  });

  it("returns response from first handler which returns", async () => {
    const plugins = [
      () => ({ onError: () => void 0 }),
      () => ({ onError: () => new Request("http://first.invalid") }),
      () => ({ onError: () => new Request("http://second.invalid") }),
    ] as const;

    server.use(http.get("http://host.invalid", () => HttpResponse.error()));

    const res = await buildFetch(...plugins)("http://host.invalid");

    expect(await res.json()).toMatchObject({ url: "http://first.invalid/" });
  });
});
