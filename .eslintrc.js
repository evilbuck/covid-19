// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  extends: 'eslint:recommended',
  env: {
    node: true,
    jest: true,
    es2017: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': ['error', { argsIgnorePattern: '__' }],
  },
  globals: {
    knex: 'writeable',
    __: 'readonly',
  },
};
