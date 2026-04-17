import eslint from '@eslint/js';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: ['src/**/*.js', 'prisma/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
