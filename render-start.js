#!/usr/bin/env node

/**
 * Render.com Production Startup Script for Gandhi Bai Healthcare CRM
 * This script ensures proper startup for full-stack application (frontend + backend)
 * Updated: August 31, 2025 - Fixed to serve frontend and backend together
 */

// Set production environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || process.env.API_PORT || '4000';

console.log('🚀 Starting Gandhi Bai Healthcare CRM Full-Stack on Render.com...');
console.log(`📅 Deployment Date: ${new Date().toISOString()}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔧 Port: ${process.env.PORT}`);
console.log(`🎯 Serving: Frontend + Backend combined`);

// Import and start the server directly from index.js
import('./server/index.js').catch((error) => {
  console.error('💥 Application startup failed:', error);
  console.error('📋 Error details:', error.message);
  console.error('🔍 Stack trace:', error.stack);
  process.exit(1);
});
