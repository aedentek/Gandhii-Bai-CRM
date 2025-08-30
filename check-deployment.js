#!/usr/bin/env node

/**
 * Deployment Status Checker
 * Monitors when the new version is live
 */

const https = require('https');

const checkDeployment = async () => {
  console.log('🔍 Checking deployment status...');
  
  try {
    const response = await fetch('https://crm.gandhibaideaddictioncenter.com/');
    const text = await response.text();
    
    if (text.includes('<!DOCTYPE html>')) {
      console.log('✅ SUCCESS! Frontend is now live!');
      console.log('🎉 Your CRM is showing the UI instead of JSON');
      console.log('🔗 Visit: https://crm.gandhibaideaddictioncenter.com');
      return true;
    } else if (text.includes('Gandhi Bai CRM API Server')) {
      console.log('⏳ Still showing backend JSON - deployment in progress...');
      return false;
    } else {
      console.log('❓ Unexpected response:', text.substring(0, 100));
      return false;
    }
  } catch (error) {
    console.log('❌ Error checking:', error.message);
    return false;
  }
};

const monitorDeployment = async () => {
  console.log('🚀 Monitoring Gandhi Bai CRM deployment...\n');
  
  let attempts = 0;
  const maxAttempts = 20; // 10 minutes max
  
  while (attempts < maxAttempts) {
    const isLive = await checkDeployment();
    
    if (isLive) {
      console.log('\n🎯 DEPLOYMENT COMPLETE!');
      console.log('📋 Next steps:');
      console.log('1. Visit https://crm.gandhibaideaddictioncenter.com');
      console.log('2. Test login functionality');
      console.log('3. Verify all CRM features work');
      break;
    }
    
    attempts++;
    console.log(`⏰ Waiting... (${attempts}/${maxAttempts})\n`);
    
    // Wait 30 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 30000));
  }
  
  if (attempts >= maxAttempts) {
    console.log('⚠️ Deployment taking longer than expected');
    console.log('💡 Check Render dashboard for any build errors');
  }
};

// Run the monitor
monitorDeployment();
