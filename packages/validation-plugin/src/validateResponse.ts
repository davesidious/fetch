import { Plugin } from "fetch";

import { schema } from "./";

export const validateResponse =
  <S extends schema.Schema>(bodySchema: S): Plugin<schema.infer<S>> =>
  () => ({
    postFetch: async (res) => void bodySchema.parse(await res.clone().json()),
  });
