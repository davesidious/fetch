import { expect, it } from "testing";

import * as index from "../src/";
import { loggerPlugin } from "../src/logger";

it("exports the correct files", () => {
  expect(index).toMatchObject({ loggerPlugin });
});
