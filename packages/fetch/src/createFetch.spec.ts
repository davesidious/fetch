import { beforeAll, afterAll, afterEach, it, expect, describe } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { createFetch } from "./createFetch";
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
  const plugin: Plugin = {
    onRequest: (req) => new Request(newUrl, req),
  };

  const res = await createFetch(plugin)("http://host.invalid");

  expect(await res.json()).toMatchObject({ url: newUrl });
});

it("supports typing the response", async () => {
  const plugin = {
    onResponse: () => createTypedResponse(true),
  };

  const res = await createFetch(plugin)("http://host.invalid");

  expect(await res.json()).toBe(true);
});

it("supports returning early", async () => {
  const plugin = {
    onEarlyResponse: () => createTypedResponse(true),
  };

  const res = await createFetch(plugin)("http://host.invalid");

  expect(await res.json()).toBe(true);
});

describe("error handling", () => {
  it("supports returning a response when an error is caught", async () => {
    const plugin = {
      onError: () => createTypedResponse("recovered"),
    };

    server.use(http.get("*", () => HttpResponse.error()));

    const res = await createFetch(plugin)("http://host.invalid");

    expect(await res.json()).toBe("recovered");
  });

  it("supports not returning anything when an error is caught", async () => {
    const plugin: Plugin = {
      onError: () => undefined,
    };

    server.use(http.get("*", () => HttpResponse.error()));

    await expect(() =>
      createFetch(plugin)("http://host.invalid"),
    ).rejects.toThrowError("Failed to fetch");
  });
});
