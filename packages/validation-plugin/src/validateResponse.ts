import { Plugin } from "fetch";
import * as zod from "zod";

export const validateResponse = <S extends zod.Schema>(
  bodySchema: S,
): Plugin<zod.infer<S>> => ({
  onResponse: async (res) => {
    bodySchema.parse(await res.clone().json());

    return res;
  },
});
