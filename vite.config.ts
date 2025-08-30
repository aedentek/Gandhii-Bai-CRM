import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const proxyTarget = process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';
  
  return {
    base: './', // Ensure relative paths for deployment
    server: {
      host: "::",
      port: 8080,
      strictPort: true, // Force port 8080, fail if not available
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        },
        '/Photos': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        }
      }
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html')
        },
        external: (id) => {
          // Exclude test files from production build
          return id.includes('test-') || 
                 id.includes('debug-') || 
                 id.includes('upload-test') ||
                 id.includes('quick-test') ||
                 id.includes('direct-api-test') ||
                 id.includes('direct-upload-test') ||
                 id.includes('null-values-test') ||
                 id.includes('photo-upload-fix-test') ||
                 id.includes('test-patient-attendance-crud') ||
                 id.includes('test-photo-url-fix');
        }
      }
    }
  };
});
