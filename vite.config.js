import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/y2kj/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        photos: resolve(__dirname, 'photos.html'),
      },
    },
  },
});
