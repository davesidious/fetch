import { describe, expect, it } from "@fetch-monorepo/testing";

import { replaceHeaders } from "../src/utils";

describe("", () => {
  it("replaces headers", () => {
    const res = new Response(null, { headers: { foo: "bar" } });
    const result = replaceHeaders(res, { new: "val" });

    expect(result.headers.get("foo")).not.toBe("bar");
    expect(result.headers.get("new")).toBe("val");
  });

  it("supports arrays of headers", () => {
    const res = new Response(null, { headers: { foo: "bar" } });
    const result = replaceHeaders(res, { new: ["val"] });

    expect(result.headers.get("foo")).not.toBe("bar");
    expect(result.headers.get("new")).toBe("val");
  });
});
