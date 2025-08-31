import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const proxyTarget = process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000';
  
  return {
    base: './', // Use relative paths for better compatibility
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
      // Copy .htaccess file to dist during build
      {
        name: 'copy-htaccess',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: '.htaccess',
            source: `RewriteEngine On
RewriteBase /

# CRITICAL: Fix MIME types for JavaScript modules (Multiple methods for Hostinger compatibility)
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType application/javascript .mjs
    AddType text/css .css
    AddType application/json .json
</IfModule>

# Alternative MIME type method for shared hosting
<Files "*.js">
    ForceType application/javascript
</Files>

<Files "*.mjs">
    ForceType application/javascript
</Files>

<Files "*.css">
    ForceType text/css
</Files>

# Handle client-side routing for React SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
</IfModule>`
          });
        }
      }
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
      },
      // Custom plugin to copy .htaccess after build
      plugins: [
        {
          name: 'copy-htaccess',
          writeBundle() {
            try {
              copyFileSync('.htaccess', 'dist/.htaccess');
              console.log('✅ .htaccess copied to dist folder');
            } catch (error) {
              console.log('⚠️ Could not copy .htaccess:', error instanceof Error ? error.message : 'Unknown error');
            }
          }
        }
      ]
    }
  };
});
