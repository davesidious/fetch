import { buildFetch } from "@fetch-monorepo/fetch";
import { expect, it, mockResponse, vi } from "@fetch-monorepo/testing";

import { loggerPlugin } from "../src/logger";

it("calls a callback on each request", async () => {
  const callback = vi.fn();
  const plugin = loggerPlugin(callback);
  const fetch = buildFetch(plugin, mockResponse());

  await fetch("http://site.invalid");

  expect(callback).toHaveBeenCalledOnce();

  expect(callback).toHaveBeenCalledWith(
    expect.any(Request),
    expect.any(Response),
    expect.any(Number),
  );
});
