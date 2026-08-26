import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

const root = import.meta.dirname;

export default defineConfig({
  root,
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        echoChamber: resolve(root, 'echo-chamber.html'),
        dam: resolve(root, 'dam.html'),
        mimicMoss: resolve(root, 'mimic-moss.html'),
        sporeTelegraph: resolve(root, 'spore-telegraph.html'),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
