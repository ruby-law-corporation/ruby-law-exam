import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '../..');

export default defineConfig({
  plugins: [react()],
  // Read env from the workspace root so a single .env serves the whole repo.
  envDir: root,
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
      '@app/types': path.resolve(root, 'packages/types/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
