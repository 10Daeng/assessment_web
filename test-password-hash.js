#!/usr/bin/env node

/**
 * Password Hash Diagnostic Tool
 *
 * Helps diagnose admin login issues by:
 * 1. Generating hash for your password
 * 2. Testing if a hash matches a password
 */

const bcrypt = require('bcryptjs');

// Get command line arguments
const password = process.argv[2];
const hashToTest = process.argv[3];

console.log('=== Password Hash Diagnostic Tool ===\n');

if (hashToTest) {
  // Test mode: verify if hash matches password
  console.log('Testing password match...\n');
  console.log('Password:', password);
  console.log('Hash to test:', hashToTest.substring(0, 30) + '...\n');

  bcrypt.compare(password, hashToTest)
    .then(isMatch => {
      if (isMatch) {
        console.log('✅ MATCH! Password is correct.\n');
      } else {
        console.log('❌ NO MATCH! Password is incorrect.\n');
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });

} else if (password) {
  // Generate mode: create hash for password
  console.log('Generating hash for password...\n');
  console.log('Password:', password);
  console.log('');

  bcrypt.hash(password, 12)
    .then(hash => {
      console.log('✅ Hash generated successfully!\n');
      console.log('========================================');
      console.log('ADMIN_PASSWORD_HASH=' + hash);
      console.log('========================================\n');
      console.log('📋 Instructions:');
      console.log('1. Copy the hash above');
      console.log('2. Set in Vercel as ADMIN_PASSWORD_HASH');
      console.log('3. Also set ADMIN_USERNAME (e.g., "admin")');
      console.log('4. Redeploy the application\n');
      console.log('⚠️  Keep your password secure!\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });

} else {
  // Show usage
  console.log('Usage:\n');
  console.log('Generate hash:');
  console.log('  node test-password-hash.js "your-password"\n');
  console.log('Test hash:');
  console.log('  node test-password-hash.js "your-password" "$2b$12$...hash..."');
  console.log('\nExample:');
  console.log('  node test-password-hash.js "MyPassword123!"');
  console.log('  node test-password-hash.js "MyPassword123!" "$2b$12$h25btBiAT4Y20n3i0B9rMubXLsDbNPFem2SoCxO7Fb8L7zO60Lv4W"\n');
  process.exit(0);
}
