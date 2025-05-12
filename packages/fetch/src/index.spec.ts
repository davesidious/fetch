import { expect, it } from "testing";

import * as index from "./";
import { buildFetch } from "./buildFetch";
import { wrapFetch } from "./wrapFetch";

it("exports the correct files", () => {
  expect(index).toMatchObject({ buildFetch, wrapFetch });
});
