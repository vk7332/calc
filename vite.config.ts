
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Use /calc/ for GitHub Pages, / for Vercel/local
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'VK Tax Calculator',
        short_name: 'VKTax',
        description: 'Professional Income Tax Calculator and Audit Portal',
        theme_color: '#1e40af',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor_react';
            if (id.includes('@supabase')) return 'vendor_supabase';
            if (id.includes('jspdf')) return 'vendor_pdf';
            if (id.includes('lucide-react')) return 'vendor_icons';
            if (id.includes('jspdf-autotable')) return 'vendor_pdf_table';
            return 'vendor_misc';
          }
          if (id.includes('/src/components/')) return 'chunk_components';
          if (id.includes('/src/pages/')) return 'chunk_pages';
          if (id.includes('/src/engines/')) return 'chunk_engines';
        },
      },
    },
  },
});