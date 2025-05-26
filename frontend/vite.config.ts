import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  define: {
    'process.env': process.env,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('cropper-'),
        },
      },
    }),
  ],
  server: {
    port: 5080,
  },
});