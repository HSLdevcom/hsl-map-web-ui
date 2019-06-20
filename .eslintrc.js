module.exports = {
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  extends: [ 'react-app', 'plugin:prettier/recommended' ],
  rules: {
    'no-param-reassign': 0,
    'react/prop-types': 0,
    'react/jsx-filename-extension': [ 'error', { extensions: [ '.js' ] } ],
    'react/prefer-stateless-function': 0,
    'prefer-template': 0,
    'prettier/prettier': 1
  }
}
