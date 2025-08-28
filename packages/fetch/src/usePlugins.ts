import { applyPlugins } from "./applyPlugins";
import { Plugin } from "./types";

export const usePlugins = <Plugins extends Plugin[]>(...plugins: Plugins) =>
  applyPlugins(globalThis.fetch, ...plugins);
