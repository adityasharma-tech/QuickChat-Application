module.exports = {
  extends: ['eslint:recommended', '@react-native'],
  rules: {
    // Add 4 blank lines between function declarations
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: 'function', next: 'function' },
      { blankLine: 'always', prev: 'block-like', next: 'block-like' },
      // Add 2 blank lines between variable declarations
      { blankLine: 'always', prev: 'var', next: 'var' },
      { blankLine: 'always', prev: 'const', next: 'const' },
    ],
  },
  root: true,
};
