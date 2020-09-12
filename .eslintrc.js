module.exports = {
  extends: [
    'airbnb-base',
    'plugin:mithril/recommended'
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  globals: {
    m: true
  },
  rules: {
    'arrow-body-style': [0],
    'no-underscore-dangle': [0],
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', { code: 150 }],
    'quote-props': ['error', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 10 }],
    'global-require': [0],
    camelcase: ['off'],
    quotes: ['error', 'single'],
    indent: ['error', 2]
  },
  overrides: [{
    files: ['*.spec.js'],
    rules: {
      'global-require': 'off'
    }
  }]
};