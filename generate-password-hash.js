#!/usr/bin/env node

/**
 * Password Hash Generator for Lentera Batin Assessment App
 *
 * This script generates a secure bcrypt hash for your admin password.
 * Run this locally and copy the output to Vercel environment variables.
 */

const bcrypt = require('bcryptjs');

// Get password from command line argument or prompt
const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Please provide a password as an argument.');
  console.log('');
  console.log('Usage: node generate-password-hash.js "your-secure-password"');
  console.log('');
  console.log('Example:');
  console.log('  node generate-password-hash.js "MySecureP@ssw0rd123!"');
  process.exit(1);
}

if (password.length < 8) {
  console.warn('⚠️  Warning: Password should be at least 8 characters long for security.');
}

// Generate hash with cost factor 12 (good balance of security and performance)
bcrypt.hash(password, 12)
  .then(hash => {
    console.log('');
    console.log('✅ Password hash generated successfully!');
    console.log('');
    console.log('========================================');
    console.log('ADMIN_PASSWORD_HASH=' + hash);
    console.log('========================================');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Copy the hash above');
    console.log('2. Go to Vercel Dashboard → Project → Settings → Environment Variables');
    console.log('3. Add new variable:');
    console.log('   - Key: ADMIN_PASSWORD_HASH');
    console.log('   - Value: (paste the hash)');
    console.log('4. Also ensure ADMIN_USERNAME is set (e.g., "admin")');
    console.log('5. Redeploy the application');
    console.log('');
    console.log('⚠️  IMPORTANT: Keep your original password secure!');
    console.log('   The hash cannot be reversed to get the password back.');
    console.log('');
  })
  .catch(error => {
    console.error('❌ Error generating hash:', error);
    process.exit(1);
  });
