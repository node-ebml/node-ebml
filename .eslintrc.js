module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  globals: {
    Uint8Array: true,
    DataView: true,
    Buffer: true,
    TextDecoder: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      scriptType: 'module',
    },
  },
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
    'plugin:flowtype/recommended',
    'prettier',
  ],
  plugins: ['node', 'import', 'prettier', 'flowtype'],
  rules: {
    'node/no-unsupported-features/es-syntax': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    'no-bitwise': 'off',
    'no-extra-parens': [
      'off',
      'all',
      {
        conditionalAssign: true,
        nestedBinaryExpressions: false,
        returnAssign: false,
        enforceForArrowConditionals: false,
      },
    ],
  },
};
