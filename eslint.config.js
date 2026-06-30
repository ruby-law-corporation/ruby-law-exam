import { defineConfig } from 'eslint/config';
import baseConfig from './packages/eslint-config/base.js';
import reactConfig from './packages/eslint-config/react.js';

// Root flat config so eslint resolves a config when invoked from the repo
// root (e.g. lint-staged in the pre-commit hook). The per-workspace
// `eslint.config.js` files still drive `pnpm lint` via turbo; this mirrors
// them, scoping the React rules to the web app and the base rules elsewhere.
export default defineConfig([
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/build/**'],
  },
  {
    files: ['apps/web/**/*.{ts,tsx,js,jsx}'],
    extends: [reactConfig],
  },
  {
    files: ['apps/api/**/*.{ts,tsx,js,jsx}', 'packages/**/*.{ts,tsx,js,jsx}'],
    extends: [baseConfig],
  },
]);
