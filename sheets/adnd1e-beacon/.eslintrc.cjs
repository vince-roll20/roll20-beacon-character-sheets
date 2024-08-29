/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-unused-expressions': [
      'error',
      {
        allowTernary: true
      }
    ],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-console': 'off',
    camelcase: 'off',
    radix: 'off',
    'no-underscore-dangle': 'off',
    // "func-names":["error", "as-needed"],
    'template-curly-spacing': ['error', 'never'],
    'no-useless-escape': 'off',
    'no-plusplus': 'off',
    'no-multi-assign': 'off',
    'no-param-reassign': [
      'error',
      {
        props: false
      }
    ],
    'no-bitwise': [
      'error',
      {
        allow: ['~']
      }
    ],
    'max-classes-per-file': 'off',
    //"func-names":["error", "as-needed"],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        arrowParens: 'always',
        useTabs: false,
        tabWidth: 2,
        endOfLine: 'lf',
        semi: true,
        printWidth: 180,
        bracketSpacing: false
      }
    ]
  }
};
