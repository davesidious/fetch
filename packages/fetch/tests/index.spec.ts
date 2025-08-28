import { expect, it } from "@fetch-monorepo/testing";

import * as index from "../src/";
import { buildFetch } from "../src/buildFetch";
import { wrapFetch } from "../src/wrapFetch";

it("exports the correct files", () => {
  expect(index).toMatchObject({ buildFetch, wrapFetch });
});
