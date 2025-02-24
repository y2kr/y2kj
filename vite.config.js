import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/y2krdemo/', // Set the base path to match your GitHub Pages subdirectory
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
