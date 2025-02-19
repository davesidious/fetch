import { Plugin } from "fetch";
import schema from "zod";
export * as schema from "zod";

export const validationPlugin =
  <S extends schema.Schema>(bodySchema: S): Plugin<schema.infer<S>> =>
  () => ({
    postFetch: async (res) => void bodySchema.parse(await res.clone().json()),
  });
