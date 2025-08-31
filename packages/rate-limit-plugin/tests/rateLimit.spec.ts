import { usePlugins } from "@davesidious/fetch";
import {
  afterEach,
  beforeEach,
  expect,
  it,
  mockResponse,
  vi,
} from "@davesidious/testing";

import { rateLimitPlugin } from "../src/rateLimit";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("retries on a 429 response with a retry-after header", async () => {
  expect.assertions(2);

  const fetch = usePlugins(
    mockResponse({ count: 1 }, "limited", { "retry-after": "1" }, 429),
    mockResponse({ count: 1 }, "ok"),
    rateLimitPlugin((retryAfter) => expect(retryAfter).toBe(1)),
  );

  const resPromise = fetch("http://host.invalid");
  await vi.runAllTimersAsync();
  const res = await resPromise;

  await expect(res.text()).resolves.toBe("ok");
});

it("retries on a 429 response without a retry-after header after 30 seconds", async () => {
  expect.assertions(3);

  const fetch = usePlugins(
    mockResponse({ count: 1 }, "limited", {}, 429),
    mockResponse({ count: 1 }, "ok"),
    rateLimitPlugin((retryAfter) => expect(retryAfter).toBe(30)),
  );

  const resPromise = fetch("http://host.invalid");
  await vi.runAllTimersAsync();
  const res = await resPromise;

  await expect(res.text()).resolves.toBe("ok");
});
