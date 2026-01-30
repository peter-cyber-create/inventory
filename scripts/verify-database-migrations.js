#!/usr/bin/env node

/**
 * Database Migration Verification Script
 * Verifies that all migrations have been run successfully
 */

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/environments/backend.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'inventory_db',
  process.env.DB_USER || 'inventory_user',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

async function verifyMigrations() {
  try {
    console.log('🔍 Verifying database migrations...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Check if SequelizeMeta table exists (tracks migrations)
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'SequelizeMeta'
      );
    `);

    if (!results[0].exists) {
      console.log('⚠️  SequelizeMeta table not found. No migrations have been run yet.');
      console.log('   Run: cd backend && ./run-migrations.sh\n');
      process.exit(1);
    }

    // Get list of executed migrations
    const [executedMigrations] = await sequelize.query(`
      SELECT name FROM "SequelizeMeta" ORDER BY name;
    `);

    console.log(`✅ Found ${executedMigrations.length} executed migrations:\n`);
    executedMigrations.forEach((migration, index) => {
      console.log(`   ${index + 1}. ${migration.name}`);
    });

    // Check for critical tables
    console.log('\n🔍 Verifying critical tables...\n');
    
    const criticalTables = [
      'users',
      'assets',
      'vehicles',
      'stores_grn',
      'stores_form76a',
      'stores_ledger',
      'activities',
      'jobcards'
    ];

    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const existingTables = tables.map(t => t.table_name);
    const missingTables = criticalTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('⚠️  Missing critical tables:');
      missingTables.forEach(table => console.log(`   - ${table}`));
      console.log('\n   Run migrations: cd backend && ./run-migrations.sh\n');
      process.exit(1);
    } else {
      console.log('✅ All critical tables exist\n');
    }

    // Verify users table structure
    console.log('🔍 Verifying users table structure...\n');
    const [userColumns] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    const requiredColumns = ['id', 'username', 'password', 'role', 'is_active'];
    const existingColumns = userColumns.map(c => c.column_name);
    const missingColumns = requiredColumns.filter(c => !existingColumns.includes(c));

    if (missingColumns.length > 0) {
      console.log('⚠️  Missing required columns in users table:');
      missingColumns.forEach(col => console.log(`   - ${col}`));
      console.log('\n   Run migrations: cd backend && ./run-migrations.sh\n');
      process.exit(1);
    } else {
      console.log('✅ Users table structure is correct\n');
    }

    console.log('✅ Database migration verification completed successfully!\n');
    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Database verification failed:');
    console.error(`   ${error.message}\n`);
    console.error('   Please check:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. Database credentials in config/environments/backend.env');
    console.error('   3. Database and user exist\n');
    process.exit(1);
  }
}

verifyMigrations();















