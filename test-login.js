#!/usr/bin/env node

/**
 * Test Login Locally
 *
 * This script tests the login functionality with your credentials.
 */

const bcrypt = require('bcryptjs');

// Test credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = '$2b$12$9SR6fTMZ4oo408Rl00KcBe2YTRd6Zqz9lm2PRBv3Pq6hKm9kPykzW';
const testUsername = 'admin';
const testPassword = 'lenterabatin2026';

console.log('=== Test Login Credentials ===\n');

// Test username
const usernameMatch = testUsername === ADMIN_USERNAME;
console.log('Username test:', testUsername, '==', ADMIN_USERNAME, '→', usernameMatch ? '✅' : '❌');

// Test password
bcrypt.compare(testPassword, ADMIN_PASSWORD_HASH)
  .then(passwordMatch => {
    console.log('Password test:', testPassword, '→', passwordMatch ? '✅' : '❌');

    if (usernameMatch && passwordMatch) {
      console.log('\n✅ LOGIN SUCCESS! Credentials are valid.\n');
      console.log('If login still fails in browser:');
      console.log('1. Check Vercel Environment Variables are set correctly');
      console.log('2. Make sure you redeployed after setting variables');
      console.log('3. Check browser console for errors');
      console.log('4. Clear browser cache and cookies\n');
    } else {
      console.log('\n❌ LOGIN FAILED! Check credentials.\n');
    }

    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
