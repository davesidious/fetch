import { buildFetch, wrapFetch } from "fetch";
import { describe, expect, it } from "testing";

import { intercept } from "../src/intercept";

const mockedFetch = buildFetch(() => ({
  preFetch: () => new Response("not intercepted"),
}));

const path = "/path";
const url = `http://host.invalid${path}`;
const method = "POST";

describe("intercepts matched routes", () => {
  it("matches by method", async () => {
    const plugin = intercept({ method }, () => new Response("intercepted"));

    const res = await wrapFetch(mockedFetch, plugin)(url, { method });

    expect(await res.text()).toBe("intercepted");
  });

  it("matches by URL", async () => {
    const plugin = intercept(
      { url: url.replace(":", "\\:") },
      () => new Response("intercepted"),
    );

    const res = await wrapFetch(mockedFetch, plugin)(url);

    expect(await res.text()).toBe("intercepted");
  });

  it("supports limiting interceptions via a counter", async () => {
    const fetch = wrapFetch(
      mockedFetch,
      intercept({ count: 1 }, () => new Response("first")),
      intercept({ count: 2 }, () => new Response("second")),
    );

    for (const res of ["first", "second", "second", "not intercepted"])
      await expect((await fetch(url)).text()).resolves.toBe(res);
  });
});

it("does not intercept unmatched routes", async () => {
  const plugin = intercept(
    { method, url: url.replace(":", "\\:") },
    () => new Response("intercepted"),
  );

  const res = await wrapFetch(mockedFetch, plugin)("http://different.invalid");

  expect(await res.text()).toBe("not intercepted");
});
