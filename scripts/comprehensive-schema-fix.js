#!/usr/bin/env node

/**
 * Comprehensive Database Schema Fix
 * Fixes all missing columns and tables
 */

const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
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

async function fixAllSchemaIssues() {
  try {
    console.log('🔧 Comprehensive Database Schema Fix...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    const queryInterface = sequelize.getQueryInterface();

    // 1. Fix assets table - add all missing columns
    console.log('📦 Fixing assets table...');
    const assetsColumns = await queryInterface.describeTable('assets');
    const assetsColumnsToAdd = {
      'processor': { type: DataTypes.STRING, defaultValue: null },
      'memory': { type: DataTypes.STRING, defaultValue: null },
      'graphics': { type: DataTypes.STRING, defaultValue: null },
      'storage': { type: DataTypes.STRING, defaultValue: null },
      'orderNo': { type: DataTypes.STRING, defaultValue: null },
      'supplier': { type: DataTypes.STRING, defaultValue: null },
      'funding': { type: DataTypes.STRING, defaultValue: null },
      'invoiceNo': { type: DataTypes.STRING, defaultValue: null },
      'purchaseDate': { type: DataTypes.DATE, defaultValue: null },
      'cost': { type: DataTypes.DECIMAL(12, 2), defaultValue: null },
      'warranty': { type: DataTypes.STRING, defaultValue: null },
      'warrantyExpiry': { type: DataTypes.DATE, defaultValue: null },
      'location': { type: DataTypes.STRING, defaultValue: null },
      'condition': { type: DataTypes.STRING, defaultValue: 'good' },
      'remarks': { type: DataTypes.TEXT, defaultValue: null }
    };

    for (const [columnName, columnDef] of Object.entries(assetsColumnsToAdd)) {
      if (!assetsColumns[columnName]) {
        try {
          await queryInterface.addColumn('assets', columnName, columnDef);
          console.log(`   ✅ Added ${columnName}`);
        } catch (error) {
          if (!error.message.includes('already exists')) {
            console.warn(`   ⚠️  Could not add ${columnName}: ${error.message}`);
          }
        }
      }
    }
    console.log('✅ assets table fixed\n');

    // 2. Fix audit_log table
    console.log('📦 Fixing audit_log table...');
    try {
      const auditColumns = await queryInterface.describeTable('audit_log');
      
      const auditColumnsNeeded = {
        'log_id': { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        'action': { type: DataTypes.STRING, allowNull: false },
        'entity': { type: DataTypes.STRING, allowNull: false },
        'entity_id': { type: DataTypes.INTEGER, allowNull: true },
        'username': { type: DataTypes.STRING, defaultValue: 'system' },
        'status': { type: DataTypes.STRING, defaultValue: 'success' },
        'message': { type: DataTypes.TEXT, defaultValue: null },
        'old_values': { type: DataTypes.JSON, defaultValue: null },
        'new_values': { type: DataTypes.JSON, defaultValue: null },
        'user_id': { type: DataTypes.INTEGER, defaultValue: null },
        'ip_address': { type: DataTypes.STRING, defaultValue: null },
        'user_agent': { type: DataTypes.TEXT, defaultValue: null },
        'timestamp': { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
      };

      for (const [columnName, columnDef] of Object.entries(auditColumnsNeeded)) {
        if (!auditColumns[columnName]) {
          try {
            await queryInterface.addColumn('audit_log', columnName, columnDef);
            console.log(`   ✅ Added ${columnName}`);
          } catch (error) {
            if (!error.message.includes('already exists')) {
              console.warn(`   ⚠️  Could not add ${columnName}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      console.log('   ℹ️  audit_log table does not exist, will be created by migrations');
    }
    console.log('✅ audit_log table fixed\n');

    // 3. Check and fix other critical tables
    console.log('📦 Checking other critical tables...');
    const tables = ['category', 'brand', 'type', 'staff', 'depart', 'division'];
    
    for (const tableName of tables) {
      try {
        await queryInterface.describeTable(tableName);
        console.log(`   ✅ ${tableName} table exists`);
      } catch (error) {
        console.log(`   ⚠️  ${tableName} table does not exist - will need manual creation or migration`);
      }
    }
    
    console.log('\n✅✅✅ Database schema fix complete! ✅✅✅');
    console.log('\n💡 Restart the backend server to apply changes');
    console.log('   Kill any running node processes and start the backend again');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing database schema:', error.message);
    process.exit(1);
  }
}

fixAllSchemaIssues();
