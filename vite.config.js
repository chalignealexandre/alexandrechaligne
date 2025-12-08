import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: './index.html',
        about: './pages/about.html',
        services: './pages/services.html',
        portfolio: './pages/portfolio.html',
        contact: './pages/contact.html',
        'projects/villa-vandoeuvres': './pages/projects/villa-vandoeuvres.html',
        'projects/chateau-glana': './pages/projects/chateau-glana.html',
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
