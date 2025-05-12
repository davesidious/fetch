import { createFetch, Plugin } from "fetch";
import * as zod from "zod";

export const validateResponse = <S extends zod.Schema>(
  bodySchema: S,
): Plugin<zod.infer<S>> => ({
  onResponse: (resPromise) =>
    resPromise
      .then((res) => res.clone().json())
      .then((body) => bodySchema.parse(body))
      .then(() => resPromise),
});

const schema = zod.object({
  thing: zod.literal("yeh"),
});
const plugin = validateResponse(schema);
const fetch = createFetch(plugin);

void fetch("http://whatever.invalid")
  .then((res) => res.json())
  .then((bleh) => {
    console.log("bleh:", bleh);
  });
