import { it, expect } from "vitest";
import * as zod from "zod";
import { validateResponse } from "./validateResponse";
import { createFetch, Plugin } from "fetch";

const mockResponse = (body: unknown): Plugin => ({
  onEarlyResponse: () => new Response(JSON.stringify(body)),
});

it("validates response bodies", async () => {
  const plugin = validateResponse(zod.object({ foo: zod.literal("bar") }));
  const fetch = createFetch(mockResponse({ foo: "bar" }), plugin);

  const res = await fetch("http://host.invalid");
  const body = await res.json();

  expect(body).toMatchObject({ foo: "bar" });
  expect(body.foo).toBe("bar");
});

it("throws an error if the body does not validate against the schema", async () => {
  const plugin = validateResponse(zod.object({ foo: zod.literal("bar") }));
  const fetch = createFetch(mockResponse({ foo: "baz" }), plugin);

  const res = fetch("http://host.invalid");

  await expect(res).rejects.toBeInstanceOf(zod.ZodError);
});
