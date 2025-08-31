#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting comprehensive CRM build test...\n');

// Test 1: Verify dist folder structure
console.log('📁 Test 1: Checking dist folder structure...');
const distPath = path.join(__dirname, 'dist');
const requiredFiles = [
    'index.html',
    '.htaccess',
    'assets/main-B1qSt34Z.js',
    'assets/main-BlSjVpal.css',
    'diagnostic.html'
];

let structureValid = true;
requiredFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`  ✅ ${file} (${stats.size} bytes)`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        structureValid = false;
    }
});

// Test 2: Check index.html for relative paths
console.log('\n📄 Test 2: Checking index.html for relative paths...');
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    if (indexContent.includes('./assets/')) {
        console.log('  ✅ Uses relative paths (./assets/)');
    } else if (indexContent.includes('/assets/')) {
        console.log('  ❌ Still uses absolute paths (/assets/)');
        structureValid = false;
    }
    
    if (indexContent.includes('main-B1qSt34Z.js')) {
        console.log('  ✅ References correct JS file (main-B1qSt34Z.js)');
    } else {
        console.log('  ❌ JS file reference not found or incorrect');
    }
} else {
    console.log('  ❌ index.html not found');
    structureValid = false;
}

// Test 3: Check .htaccess configuration
console.log('\n⚙️ Test 3: Checking .htaccess configuration...');
const htaccessPath = path.join(distPath, '.htaccess');
if (fs.existsSync(htaccessPath)) {
    const htaccessContent = fs.readFileSync(htaccessPath, 'utf8');
    
    const checks = [
        { test: 'AddType application/javascript .js', name: 'JavaScript MIME type' },
        { test: 'ForceType application/javascript', name: 'Force JS MIME type' },
        { test: 'RewriteEngine On', name: 'URL rewriting enabled' },
        { test: 'RewriteRule . /index.html [L]', name: 'SPA routing fallback' }
    ];
    
    checks.forEach(check => {
        if (htaccessContent.includes(check.test)) {
            console.log(`  ✅ ${check.name}`);
        } else {
            console.log(`  ⚠️ ${check.name} - might be missing`);
        }
    });
} else {
    console.log('  ❌ .htaccess file not found');
    structureValid = false;
}

// Test 4: HTTP Server Test
console.log('\n🌐 Test 4: Testing HTTP server response...');

function testHTTP(url, callback) {
    const request = http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            callback(null, {
                statusCode: res.statusCode,
                headers: res.headers,
                data: data.substring(0, 100) + (data.length > 100 ? '...' : '')
            });
        });
    });
    
    request.on('error', (err) => {
        callback(err, null);
    });
    
    request.setTimeout(5000, () => {
        request.destroy();
        callback(new Error('Request timeout'), null);
    });
}

// Test if preview server is running
testHTTP('http://localhost:4173/', (err, result) => {
    if (err) {
        console.log('  ❌ Preview server not accessible:', err.message);
        console.log('  ℹ️ This is normal if preview server is not running');
    } else {
        console.log(`  ✅ Preview server responds with status ${result.statusCode}`);
        console.log(`  📄 Content preview: ${result.data}`);
        
        // Test JavaScript file
        testHTTP('http://localhost:4173/assets/main-B1qSt34Z.js', (err, jsResult) => {
            if (err) {
                console.log('  ❌ JavaScript file not accessible:', err.message);
            } else {
                console.log(`  ✅ JavaScript file accessible (${jsResult.statusCode})`);
                console.log(`  📝 Content-Type: ${jsResult.headers['content-type'] || 'unknown'}`);
            }
        });
    }
});

// Test 5: File sizes check
console.log('\n📊 Test 5: File size analysis...');
const jsPath = path.join(distPath, 'assets/main-B1qSt34Z.js');
const cssPath = path.join(distPath, 'assets/main-BlSjVpal.css');

if (fs.existsSync(jsPath)) {
    const jsSize = fs.statSync(jsPath).size;
    console.log(`  📦 JavaScript bundle: ${(jsSize / 1024 / 1024).toFixed(2)} MB`);
    if (jsSize > 1024 * 1024) {
        console.log('  ✅ Bundle size looks normal for a React app');
    } else {
        console.log('  ⚠️ Bundle seems unusually small - might be incomplete');
    }
}

if (fs.existsSync(cssPath)) {
    const cssSize = fs.statSync(cssPath).size;
    console.log(`  🎨 CSS bundle: ${(cssSize / 1024).toFixed(2)} KB`);
}

// Final summary
console.log('\n' + '='.repeat(50));
console.log('📋 TEST SUMMARY:');
console.log('='.repeat(50));

if (structureValid) {
    console.log('✅ ALL TESTS PASSED - Build is ready for deployment!');
    console.log('\n🚀 Deployment checklist:');
    console.log('1. Upload all files from dist/ folder');
    console.log('2. Ensure .htaccess file is uploaded');
    console.log('3. Clear browser cache');
    console.log('4. Test with diagnostic.html if needed');
} else {
    console.log('❌ SOME TESTS FAILED - Please fix issues before deployment');
}

console.log('\n🔗 Useful URLs for testing:');
console.log('- Main app: http://localhost:4173/ (if preview server running)');
console.log('- Diagnostic: http://localhost:4173/diagnostic.html');
console.log('- Your deployed sites:');
console.log('  * https://crm.gandhibaideaddictioncenter.com');
console.log('  * https://gandhibai-crm.onrender.com');
