module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  extends: ["airbnb", "plugin:prettier/recommended"],
  rules: {
    "no-param-reassign": 0,
    "react/prop-types": 0,
    "react/jsx-filename-extension": ["error", { extensions: [".js"] }],
    "react/prefer-stateless-function": 0,
    "prefer-template": 0,
    "prettier/prettier": 1
  },
  settings: {
    "import/resolver": "webpack"
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  plugins: ["react"]
};
