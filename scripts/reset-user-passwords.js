#!/usr/bin/env node

/**
 * Reset User Passwords Script
 * Resets passwords for default users to meet security requirements
 * 
 * Usage: node scripts/reset-user-passwords.js [password]
 * If no password provided, uses default: Admin@123
 */

const path = require('path');

// Add backend node_modules to NODE_PATH so we can require bcrypt
process.env.NODE_PATH = path.join(__dirname, '../backend/node_modules') + (process.env.NODE_PATH ? ':' + process.env.NODE_PATH : '');
require('module')._initPaths();

const bcrypt = require('bcrypt');
require('dotenv').config({ path: path.join(__dirname, '../config/environments/backend.env') });

const { sequelize } = require('../backend/config/db');
const UserModel = require('../backend/models/users/userModel');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// Default users to create/reset
const DEFAULT_USERS = [
  {
    username: 'admin',
    email: 'admin@moh.go.ug',
    role: 'admin',
    firstname: 'System',
    lastname: 'Administrator',
    module: 'all',
    depart: 'Administration',
    is_active: true
  },
  {
    username: 'it_manager',
    email: 'it@moh.go.ug',
    role: 'it',
    firstname: 'IT',
    lastname: 'Manager',
    module: 'ict',
    depart: 'ICT Department',
    is_active: true
  },
  {
    username: 'store_manager',
    email: 'store@moh.go.ug',
    role: 'store',
    firstname: 'Store',
    lastname: 'Manager',
    module: 'stores',
    depart: 'Stores Department',
    is_active: true
  },
  {
    username: 'fleet_manager',
    email: 'fleet@moh.go.ug',
    role: 'garage',
    firstname: 'Fleet',
    lastname: 'Manager',
    module: 'fleet',
    depart: 'Fleet Management',
    is_active: true
  },
  {
    username: 'finance_manager',
    email: 'finance@moh.go.ug',
    role: 'finance',
    firstname: 'Finance',
    lastname: 'Manager',
    module: 'finance',
    depart: 'Finance Department',
    is_active: true
  }
];

async function resetUserPasswords(newPassword = 'Admin@123') {
  try {
    console.log('🔐 Resetting user passwords...\n');
    console.log(`Using password: ${newPassword}\n`);

    // Validate password meets requirements
    if (newPassword.length < 8) {
      console.error('❌ Password must be at least 8 characters long');
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    console.log('✅ Password hashed successfully\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // Process each user
    for (const userData of DEFAULT_USERS) {
      try {
        // Check if user exists
        let user = await UserModel.findOne({
          where: { username: userData.username }
        });

        if (user) {
          // Update existing user
          await UserModel.update(
            { 
              password: hashedPassword,
              is_active: userData.is_active,
              updatedAt: new Date()
            },
            { where: { username: userData.username } }
          );
          console.log(`✅ Updated password for: ${userData.username} (${userData.role})`);
        } else {
          // Create new user
          await UserModel.create({
            ...userData,
            password: hashedPassword
          });
          console.log(`✅ Created user: ${userData.username} (${userData.role})`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${userData.username}:`, error.message);
      }
    }

    console.log('\n✅ Password reset complete!');
    console.log('\n📋 Login Credentials:');
    DEFAULT_USERS.forEach(u => {
      console.log(`   • ${u.username} / ${newPassword} (${u.role})`);
    });
    console.log('\n⚠️  SECURITY: Change all passwords immediately after first login!\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

// Get password from command line or use default
const password = process.argv[2] || 'Admin@123';

resetUserPasswords(password);

