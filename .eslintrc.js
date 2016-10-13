module.exports = {
    parserOptions: {
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        }
    },
    extends: "airbnb",
    rules: {
        "indent": ["error", 4],
        "quotes": ["error", "double", {"avoidEscape": true}],
        "no-param-reassign": 0,
        "react/prop-types": 0,
        "react/jsx-indent": ["error", 4],
        "react/jsx-filename-extension": ["error", {"extensions": [".js"]}],
        "react/jsx-space-before-closing": ["error", "never"],
        "react/prefer-stateless-function": 0,
        "prefer-template": 0,
        },
    settings: {
        "import/resolver": "webpack"
    },
    env: {
        "browser": true,
        "node": true,
        "es6": true
    },
    "plugins": [
        "react"
    ]
};