import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

import formatting from "./configs/formatting.mjs";
import imports from "./configs/imports.mjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { ignores: ["**/dist/", "**/coverage/"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  ...imports,
  ...formatting,
];
