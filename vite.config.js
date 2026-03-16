import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
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
        'projects/project': './pages/projects/project.html',
        'projects/villa-vandoeuvres': './pages/projects/villa-vandoeuvres.html',
        'projects/chateau-glana': './pages/projects/chateau-glana.html',
        'mentions-legales': './pages/mentions-legales.html',
        'politique-confidentialite': './pages/politique-confidentialite.html',
      }
    },
    // Copy locales folder to dist
    copyPublicDir: true,
  },
  server: {
    port: 3000,
    open: true
  },
  // Ensure locales are served correctly in dev
  assetsInclude: ['**/*.json'],
  // Plugin to handle /en/ URL rewrites for i18n
  plugins: [
    {
      name: 'i18n-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Handle /en/ prefix - rewrite to actual file paths
          if (req.url.startsWith('/en/')) {
            // Remove /en prefix and serve the same file
            req.url = req.url.replace('/en/', '/');
          } else if (req.url === '/en') {
            req.url = '/index.html';
          }

          // Dynamic project pages (dev only): serve the single template
          // Example: /pages/projects/appartement-prive.html -> /pages/projects/project.html
          if (/^\/pages\/projects\/[^/]+(\.html)?(\?.*)?$/.test(req.url) && !req.url.startsWith('/pages/projects/project')) {
            const queryIndex = req.url.indexOf('?');
            const query = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
            req.url = `/pages/projects/project.html${query}`;
          }

          next();
        });
      }
    }
  ]
});
