import { buildFetch } from "fetch";
import { expect, it } from "testing";

import { cachePlugin } from "./cache";

it("caches responses", async () => {
  const cacheTtl = 1000;
  const responsePlugin = () => ({
    preFetch: () =>
      new Response(`${Math.random()}`, {
        headers: { "cache-control": `max-age=${cacheTtl / 1000}` },
      }),
  });

  const plugin = cachePlugin({}, { max: 2 });
  const fetch = buildFetch(plugin, responsePlugin);

  const makeRequest = async () => (await fetch("http://site.invalid")).text();

  const val1 = await makeRequest();

  expect(await makeRequest()).toBe(val1);
  expect(await makeRequest()).toBe(val1);

  await new Promise((resolve) => setTimeout(resolve, cacheTtl * 1.1));

  const val2 = await makeRequest();

  expect(await makeRequest()).not.toBe(val1);
  expect(await makeRequest()).toBe(val2);
});
