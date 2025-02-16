import { Plugin } from "./types";
import { wrapFetch } from "./wrapFetch";

export const buildFetch = <Plugins extends Plugin[]>(...plugins: Plugins) =>
  wrapFetch(globalThis.fetch, ...plugins);
