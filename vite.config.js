import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: false, // avoid double-refresh
        }),

        react({
            include: "**/*.jsx",
            fastRefresh: true, // enable fast live updates
        }),

        // Reload when blade files change
        FullReload([
            "resources/views/**/*.blade.php",
            "routes/**/*.php"
        ]),
    ],

    server: {
        host: "localhost",
        port: 5173,

        // Fix slow file watching on some machines
        watch: {
            usePolling: true,      // <— IMPORTANT
            interval: 100,         // faster detection
            ignored: [
                "**/vendor/**",
                "**/storage/**",
                "**/public/**",
            ],
        },

        // Fix HMR issues
        hmr: {
            host: "localhost",
        }
    },

    resolve: {
        alias: {
            moment: 'moment',
        },
    },

    build: {
        rollupOptions: {
            external: ['@emoji-mart/react'],
        },
    },
});
