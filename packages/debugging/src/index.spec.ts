import debug from "debug";
import { expect, it } from "testing";

import defaultImport from "./";

it("exports debug", () => {
  expect(defaultImport).toBe(debug);
});
