import { expect, it } from "testing";

import * as index from "./";
import { validateResponse } from "./validateResponse";

it("exports the correct files", () => {
  expect(index).toMatchObject({ validateResponse });
});
