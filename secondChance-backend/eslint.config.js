// eslint.config.js
const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      indent: ['error', 2],
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'spaced-comment': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      'arrow-spacing': ['error', { before: true, after: true }],
    },
  },
]
