module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    sourceType: "module",
  },
  rules: {},
}
