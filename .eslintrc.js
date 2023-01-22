module.exports = {
  root: true,
  env: {
    browser: true,
    jest: true,
    node: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      warnOnUnsupportedTypeScriptVersion: false,
    },
    ecmaVersion: 7,
    project: "./tsconfig.lint.json",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "clean-regex",
    "css-modules",
    "import",
    "prettier",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  extends: [
    "eslint:recommended",
    "next",
    "plugin:@typescript-eslint/recommended",
    "plugin:clean-regex/recommended",
    "plugin:css-modules/recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "plugin:import/warnings",
    "prettier"
  ],
  rules: {
    "prettier/prettier": "error",
    "linebreak-style": "off",
    "no-console": "off",
    "no-constant-condition": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "UU",
        args: "none",
      },
    ],
    "no-useless-catch": "off",
    quotes: "off",
    semi: ["error", "always"],
    curly: ["error", "multi-line"],
    "import/named": 2,
    "import/order": ["error", {
      "newlines-between": "always",
    }],
    "import/no-unresolved": ["warn"],
    "one-var": ["error", "never"],
    "no-var": "error",
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: "*",
        next: "return",
      },
      {
        blankLine: "always",
        prev: ["const", "let", "var"],
        next: "*",
      },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },
      {
        blankLine: "always",
        prev: ["block", "block-like", "if"],
        next: "*",
      },
      {
        blankLine: "always",
        prev: "*",
        next: ["block", "block-like", "if"],
      },
      {
        blankLine: "any",
        prev: "export",
        next: "*",
      },
      {
        blankLine: "any",
        prev: "*",
        next: "export",
      },
    ],
    "react/no-danger": "off",
    "react/no-find-dom-node": "off",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".tsx", ".jsx"],
      },
    ],
    "react/prop-types": [0],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/prefer-interface": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      disallowTypeAnnotations: false,
      fixStyle: "separate-type-imports",
    }],
  },
};
