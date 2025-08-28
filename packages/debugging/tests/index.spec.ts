import { expect, it } from "@davesidious/testing";
import debug from "debug";

import defaultImport from "../src";

it("exports debug", () => {
  expect(defaultImport).toBe(debug);
});
