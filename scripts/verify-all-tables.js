#!/usr/bin/env node

/**
 * Comprehensive Database Tables Verification Script
 * Verifies ALL required tables exist for the entire system to function
 */

const path = require('path');

// Add backend node_modules to NODE_PATH so we can require sequelize
process.env.NODE_PATH = path.join(__dirname, '../backend/node_modules') + (process.env.NODE_PATH ? ':' + process.env.NODE_PATH : '');
require('module')._initPaths();

const { Sequelize } = require('sequelize');
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

// All required tables for the system
const REQUIRED_TABLES = {
  // Core tables
  users: 'User authentication and management',
  assets: 'ICT Assets management',
  
  // Category tables (required for assets)
  type: 'Asset types (ICT Equipment, etc.)',
  category: 'Asset categories',
  brand: 'Asset brands',
  model: 'Asset models',
  
  // Department/Organization
  depart: 'Departments',
  division: 'Divisions',
  staff: 'Staff members',
  
  // Stores module
  stores_grn: 'Goods Received Notes',
  stores_form76a: 'Requisition forms',
  stores_ledger: 'Stock ledger',
  stores_items: 'Store items',
  
  // Fleet module
  vehicles: 'Vehicles',
  vehicle_types: 'Vehicle types',
  vehicle_makes: 'Vehicle makes',
  vehicle_garages: 'Garages',
  vehicle_drivers: 'Drivers',
  jobcards: 'Job cards',
  
  // Finance
  activities: 'Financial activities',
  
  // Facilities
  facilities: 'Health facilities',
  
  // Audit/Logs
  audits: 'Audit logs'
};

async function verifyAllTables() {
  try {
    console.log('🔍 Verifying ALL database tables...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Get all existing tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const existingTables = tables.map(t => t.table_name.toLowerCase());
    console.log(`📊 Found ${existingTables.length} tables in database\n`);

    // Check each required table
    console.log('🔍 Checking required tables...\n');
    const missingTables = [];
    const foundTables = [];

    for (const [tableName, description] of Object.entries(REQUIRED_TABLES)) {
      // Check both exact name and lowercase
      const exists = existingTables.includes(tableName.toLowerCase()) || 
                     existingTables.includes(tableName);
      
      if (exists) {
        foundTables.push(tableName);
        console.log(`✅ ${tableName.padEnd(25)} - ${description}`);
      } else {
        missingTables.push({ name: tableName, description });
        console.log(`❌ ${tableName.padEnd(25)} - ${description} - MISSING!`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Found: ${foundTables.length}/${Object.keys(REQUIRED_TABLES).length} tables`);
    console.log(`   ❌ Missing: ${missingTables.length} tables\n`);

    if (missingTables.length > 0) {
      console.log('⚠️  MISSING TABLES (these will cause errors):\n');
      missingTables.forEach(({ name, description }) => {
        console.log(`   - ${name}: ${description}`);
      });
      console.log('\n💡 Solution: Run all migrations');
      console.log('   cd backend && npx sequelize-cli db:migrate\n');
      process.exit(1);
    } else {
      console.log('✅ All required tables exist!\n');
      
      // Check for empty critical tables
      console.log('🔍 Checking for data in critical tables...\n');
      const criticalTables = ['users', 'type', 'category', 'brand', 'model'];
      
      for (const table of criticalTables) {
        if (existingTables.includes(table.toLowerCase()) || existingTables.includes(table)) {
          const [count] = await sequelize.query(`
            SELECT COUNT(*) as count FROM "${table}";
          `);
          const rowCount = parseInt(count[0].count);
          if (rowCount === 0) {
            console.log(`⚠️  ${table}: Empty (0 rows) - May need seed data`);
          } else {
            console.log(`✅ ${table}: ${rowCount} row(s)`);
          }
        }
      }
      
      console.log('\n✅ Database is ready for all operations!\n');
      await sequelize.close();
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Database verification failed:');
    console.error(`   ${error.message}\n`);
    console.error('   Please check:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. Database credentials in config/environments/backend.env');
    console.error('   3. Database and user exist\n');
    await sequelize.close();
    process.exit(1);
  }
}

verifyAllTables();

