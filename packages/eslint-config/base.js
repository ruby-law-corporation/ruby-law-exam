import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const prettierOptions = JSON.parse(
  fs.readFileSync(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '../../.prettierrc',
    ),
    'utf8',
  ),
);

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginPrettier,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'prettier/prettier': ['error', prettierOptions],
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/build/**',
    ],
  },
];
