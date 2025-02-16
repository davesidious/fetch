import stylistic from "@stylistic/eslint-plugin";
import prettier from "eslint-plugin-prettier/recommended";

export default [
  prettier,
  { plugins: { "@stylistic": stylistic } },
  {
    rules: {
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ],
    },
  },
];
