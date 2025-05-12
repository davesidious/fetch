import debug from "debug";
import { expect, it } from "testing";

import defaultImport from "../src";

it("exports debug", () => {
  expect(defaultImport).toBe(debug);
});
