module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'react-app',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    jsx: true,
    project: './tsconfig.json',
  },
  rules: {
    // Loosen checks to ease integration with existing untyped packages
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignorePatterns: ['src/abi/types/index.ts'],
}
