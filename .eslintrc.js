module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  globals: {
  },
  parserOptions: {
  },
  rules : {
    "no-unused-vars": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-console": "off",
    "no-unreachable": "warn",
    "require-yield": "warn",
    "css-identifierexpected": "off"
  },
  env: {
    "browser": true,
    "es6": true,
    "node": true
  },
  parser: "babel-eslint"
}