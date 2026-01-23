#!/usr/bin/env node

/**
 * Migration runner that properly loads environment variables
 * and runs Sequelize migrations
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../config/environments/backend.env') });

console.log('🔄 Running database migrations...\n');

// Verify required environment variables
const requiredVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please set these in config/environments/backend.env');
  process.exit(1);
}

console.log('✅ Environment variables loaded:');
console.log(`   DB_HOST: ${process.env.DB_HOST}`);
console.log(`   DB_NAME: ${process.env.DB_NAME}`);
console.log(`   DB_USER: ${process.env.DB_USER}`);
console.log('');

// Set environment variables for the child process
const env = {
  ...process.env,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT || '5432',
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

try {
  console.log('Running Sequelize migrations...\n');
  execSync('npx sequelize-cli db:migrate --env development', {
    stdio: 'inherit',
    env: env,
    cwd: __dirname
  });
  console.log('\n✅ Migrations completed!');
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}

