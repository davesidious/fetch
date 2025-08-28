import { buildFetch, Plugin } from "@fetch-monorepo/fetch";
import { expect, it } from "@fetch-monorepo/testing";

import { schema, validationPlugin } from "../src/validation";

const mockResponse =
  (body: unknown): Plugin =>
  () => ({ preFetch: () => new Response(JSON.stringify(body)) });

it("validates response bodies", async () => {
  const plugin = validationPlugin(
    schema.object({ foo: schema.literal("bar") }),
  );
  const fetch = buildFetch(mockResponse({ foo: "bar" }), plugin);

  const res = await fetch("http://host.invalid");
  const body = await res.json();

  expect(body).toMatchObject({ foo: "bar" });
  expect(body.foo).toBe("bar");
});

it("throws an error if the body does not validate against the schema", async () => {
  const plugin = validationPlugin(
    schema.object({ foo: schema.literal("bar") }),
  );
  const fetch = buildFetch(mockResponse({ foo: "baz" }), plugin);

  const res = fetch("http://host.invalid");

  await expect(res).rejects.toBeInstanceOf(schema.ZodError);
});
