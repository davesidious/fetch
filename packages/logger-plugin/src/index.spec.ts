import { expect, it } from "testing";

import * as index from "./";
import { loggerPlugin } from "./logger";

it("exports the correct files", () => {
  expect(index).toMatchObject({ loggerPlugin });
});
