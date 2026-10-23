import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O proxy evita bloqueios de CORS em desenvolvimento: /api-tse/* -> https://resultados.tse.jus.br/*
const proxy = {
  '/api-tse': {
    target: 'https://resultados.tse.jus.br',
    changeOrigin: true,
    secure: true,
    rewrite: (path: string) => path.replace(/^\/api-tse/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { host: true, proxy },
  preview: { host: true, proxy },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
