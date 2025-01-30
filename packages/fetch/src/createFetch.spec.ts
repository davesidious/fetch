import { beforeAll, afterAll, afterEach, it, expect } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

import { createFetch, Plugin } from "./createFetch";

const server = setupServer(
  http.get("*", ({ request }) => HttpResponse.json({ url: request.url })),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

it("supports rewriting requests", async () => {
  const newUrl = "http://new.invalid/";
  const plugin: Plugin = {
    onRequest: (req) => new Request(newUrl, req),
  };

  const res = await createFetch(plugin)("http://host.invalid");

  expect(await res.json()).toMatchObject({ url: newUrl });
});

it("supports typing the response", async () => {
  const plugin: Plugin = {
    onResponse(res) {
      return res;
    },
  };

  const res = await createFetch(plugin)("http://host.invalid");

  const body = await res.json();
});

// const p1: Plugin<{ wat: string }> = {
//   onResponse: async (res) => {
//     return res as Promise<TypedResponse<{ wat: string }>>;
//   },
// };

// const p2: Plugin<{ nah: string }> = {
//   onResponse: async (res) => {
//     return res as Promise<TypedResponse<{ nah: string }>>;
//   },
// };

// const p3: Plugin = {};

// export const f = createFetch(p2, p1, p3);
