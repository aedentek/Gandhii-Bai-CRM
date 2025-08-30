#!/usr/bin/env node

/**
 * Render.com Production Startup Script for Gandhi Bai Healthcare CRM
 * This script ensures proper startup for backend
 * Updated: August 30, 2025 - Fixed server import issue
 */

// Set production environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

console.log('🚀 Starting Gandhi Bai Healthcare CRM on Render.com...');
console.log(`📅 Deployment Date: ${new Date().toISOString()}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔧 Port: ${process.env.PORT || '4000'}`);

// Import and start the server directly from index.js
import('./server/index.js').catch((error) => {
  console.error('💥 Application startup failed:', error);
  console.error('📋 Error details:', error.message);
  console.error('🔍 Stack trace:', error.stack);
  process.exit(1);
});
