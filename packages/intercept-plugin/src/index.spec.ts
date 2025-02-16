import { expect, it } from "testing";

import * as index from "./";
import { intercept } from "./intercept";

it("exports the correct files", () => {
  expect(index).toMatchObject({ intercept });
});
