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
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    ecmaFeatures: {
      jsx: false,
    },
    sourceType: 'module',
  },
  extends: [
    'airbnb-base',
    'plugin:node/recommended',
    'plugin:flowtype/recommended',
    'prettier',
  ],
  plugins: ['node', 'import', 'prettier', 'flowtype'],
  rules: {
    'prettier/prettier': ['error'],
    'no-bitwise': 'off',
  },
};
