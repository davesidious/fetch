import { expect, it } from "@davesidious/testing";

import * as index from "../src/";
import { applyPlugins } from "../src/applyPlugins";
import { usePlugins } from "../src/usePlugins";

it("exports the correct files", () => {
  expect(index).toMatchObject({ usePlugins, applyPlugins });
});
