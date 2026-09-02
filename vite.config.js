import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/isla-de-calor-3d-morelia/',
  server: {
    port: 3000,
    open: false,
    host: true,
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
});

