import { expect, it } from "testing";

import * as index from "./";
import { cachePlugin } from "./cache";

it("exports the correct files", () => {
  expect(index).toMatchObject({ cachePlugin });
});
