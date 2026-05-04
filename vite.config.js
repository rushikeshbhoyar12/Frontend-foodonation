import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
    server: {
        middlewareMode: false,
        proxy: {
            '/api': {
                target: process.env.VITE_API_URL || 'http://localhost:5000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
        },
    },
    appType: 'spa',
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                entryFileNames: 'js/[name]-[hash].js',
                chunkFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|gif|tiff|bmp|ico/i.test(ext)) {
                        return `images/[name]-[hash][extname]`;
                    } else if (/woff|woff2|ttf|otf|eot/i.test(ext)) {
                        return `fonts/[name]-[hash][extname]`;
                    } else if (ext === 'css') {
                        return `css/[name]-[hash][extname]`;
                    } else {
                        return `[name]-[hash][extname]`;
                    }
                },
            },
        },
    },
});
