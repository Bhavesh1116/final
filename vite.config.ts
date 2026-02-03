
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Import process explicitly to ensure cwd() is properly typed in the Node.js context
import process from 'node:process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // base: './' is critical for GitHub Pages so assets load relative to the current folder
    base: './', 
    define: {
      // Injects the API_KEY from the build environment into the application
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '') 
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false
    }
  };
});
