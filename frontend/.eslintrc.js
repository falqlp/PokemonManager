module.exports = {
  ignorePatterns: ['**/*.html', '/dist'],
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.html'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@angular-eslint/prefer-on-push-component-change-detection': 'off',
        '@typescript-eslint/no-restricted-imports': [
          'error',
          {
            name: 'angular',
            message: 'do not use AngularJS',
            allowTypeImports: true,
          },
        ],
        'linebreak-style': 'off',
        'no-param-reassign': 'off',
        'no-console': 'warn',
        'no-use-before-define': 'warn',
        'max-len': 'off',
        eqeqeq: 'warn',
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'vars-on-top': 'warn',
        'no-restricted-globals': [
          'error',
          {
            name: 'document',
            message: 'do not use DOM',
          },
        ],
        curly: ['error', 'all'],
        'lines-between-class-members': [
          'error',
          'always',
          { exceptAfterSingleLine: true },
        ],
        'import/prefer-default-export': 'off',
        'import/extensions': [
          'error',
          'ignorePackages',
          {
            ts: 'never',
            js: 'never',
          },
        ],
        'no-unreachable': 'error',
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'warn',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/no-explicit-any': 'warn',
        'class-methods-use-this': 'off',
        'import/no-unresolved': 'warn',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              Function: false,
            },
            extendDefaults: true,
          },
        ],
        'no-shadow': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-shadow': ['error'],
        '@angular-eslint/template/accessibility-elements-content': 'off',
        '@angular-eslint/template/accessibility-interactive-supports-focus':
          'off',
        '@angular-eslint/template/click-events-have-key-events': 'off',
        '@angular-eslint/template/i18n': 'off',
        'prettier/prettier': 'error',
        '@angular-eslint/template/attributes-order': 'off',
        '@angular-eslint/use-component-selector': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
