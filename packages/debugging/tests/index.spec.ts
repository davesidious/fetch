import { expect, it } from "@fetch-monorepo/testing";
import debug from "debug";

import defaultImport from "../src";

it("exports debug", () => {
  expect(defaultImport).toBe(debug);
});
