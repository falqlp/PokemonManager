module.exports = {
  env: {
    node: true,
  },
  ignorePatterns: ["dist/", "migration.service.js"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import", "prettier"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        name: "fs",
        message: "Please use fs/promises instead of the synchronous version",
      },
    ],
    "linebreak-style": "off",
    "no-param-reassign": "off",
    "no-console": "warn",
    "no-use-before-define": "warn",
    "max-len": "off",
    eqeqeq: "warn",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "vars-on-top": "warn",
    curly: ["error", "all"],
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "import/prefer-default-export": "off",
    "import/extensions": [
      "off",
      "ignorePackages",
      {
        ts: "never",
        js: "never",
      },
    ],
    "import/no-unresolved": "off",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "class-methods-use-this": "off",
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          Function: false,
        },
        extendDefaults: true,
      },
    ],
    "no-shadow": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-shadow": ["warn"],
    "import/no-extraneous-dependencies": "off",
  },
};
