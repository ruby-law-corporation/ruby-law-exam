import importPlugin from 'eslint-plugin-import-x';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactX from 'eslint-plugin-react-x';

import baseConfig from './base.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-x': pluginReactX,
      'react-hooks': pluginReactHooks,
      'import-x': importPlugin,
    },
    rules: {
      'react-x/no-missing-component-display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];
