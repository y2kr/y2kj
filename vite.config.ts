import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  base: '/',
  plugins: [
    eslintPlugin({
      lintOnStart: false, // Changed to false to prevent startup linting issues
      cache: false,
      include: ['src/**/*.ts', 'src/**/*.js'], // Only lint source files
      exclude: ['node_modules/**', 'dist/**'], // Explicitly exclude dist and node_modules
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  resolve: {
    extensions: ['.ts', '.js'], // Add TypeScript support
  },
});
