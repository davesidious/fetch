import { expect, it } from "@davesidious/testing";

import * as index from "../src/logger";
import { loggerPlugin } from "../src/logger";

it("exports the correct files", () => {
  expect(index).toMatchObject({ loggerPlugin });
});
