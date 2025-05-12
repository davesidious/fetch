import { it, expect } from "vitest";
import { intercept } from "./intercept";
import { createFetch, Plugin } from "fetch";

const mockResponse: Plugin = {
  onEarlyResponse: () => new Response("mocked"),
};

it("intercepts matched routes", async () => {
  const url = "http://host.invalid/";
  const method = "POST";
  const plugin = intercept({ method, url }, () => new Response("body"));

  const res = await createFetch(plugin)(url, { method });

  expect(await res.text()).toBe("body");
});

it("does not intercept unmatched routes", async () => {
  const url = "http://host.invalid/";
  const method = "POST";
  const plugin = intercept({ method, url }, () => new Response("body"));

  const res = await createFetch(
    plugin,
    mockResponse,
  )("http://different.invalid");

  expect(await res.text()).toBe("mocked");
});
