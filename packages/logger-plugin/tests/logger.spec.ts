import { usePlugins } from "@davesidious/fetch";
import { expect, it, mockResponse, vi } from "@davesidious/testing";

import { loggerPlugin } from "../src/logger";

it("calls a callback on each request", async () => {
  const callback = vi.fn();
  const plugin = loggerPlugin(callback);
  const fetch = usePlugins(plugin, mockResponse());

  await fetch("http://host.invalid");

  expect(callback).toHaveBeenCalledOnce();

  expect(callback).toHaveBeenCalledWith(
    expect.any(Request),
    expect.any(Response),
    expect.any(Number),
  );
});
