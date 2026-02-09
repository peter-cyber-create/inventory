#!/usr/bin/env node

/**
 * Recreate Assets Table with All Required Columns
 */

const path = require('path');
process.env.NODE_PATH = path.join(__dirname, '../backend/node_modules') + (process.env.NODE_PATH ? ':' + process.env.NODE_PATH : '');
require('module')._initPaths();

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

async function fixAssetsTable() {
  try {
    console.log('🔧 Fixing assets table structure...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    const queryInterface = sequelize.getQueryInterface();

    // Get all columns in assets table
    const assetColumns = await queryInterface.describeTable('assets').catch(() => ({}));
    console.log('📋 Current assets columns:', Object.keys(assetColumns));

    // All required columns for assets table based on the model
    const requiredColumns = {
      'id': { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      'description': { type: DataTypes.STRING, allowNull: false },
      'serialNo': { type: DataTypes.STRING, allowNull: true },
      'engravedNo': { type: DataTypes.STRING, allowNull: true },
      'processor': { type: DataTypes.STRING },
      'memory': { type: DataTypes.STRING },
      'graphics': { type: DataTypes.STRING },
      'storage': { type: DataTypes.STRING },
      'orderNo': { type: DataTypes.STRING },
      'supplier': { type: DataTypes.STRING },
      'status': { type: DataTypes.STRING, allowNull: false, defaultValue: 'InStores' },
      'funding': { type: DataTypes.STRING },
      'funder': { type: DataTypes.STRING },
      'purchaseCost': { type: DataTypes.DOUBLE },
      'purchaseDate': { type: DataTypes.DATE },
      'warranty': { type: DataTypes.STRING },
      'estimatedCost': { type: DataTypes.STRING },
      'requisition': { type: DataTypes.BOOLEAN, defaultValue: false },
      'storesdispatch': { type: DataTypes.BOOLEAN, defaultValue: false },
      'itissue': { type: DataTypes.BOOLEAN, defaultValue: false },
      'isdisposed': { type: DataTypes.BOOLEAN, defaultValue: false },
      'typeId': { type: DataTypes.INTEGER, allowNull: true },
      'categoryId': { type: DataTypes.INTEGER, allowNull: true },
      'brandId': { type: DataTypes.INTEGER, allowNull: true },
      'modelId': { type: DataTypes.INTEGER, allowNull: true },
      'staffId': { type: DataTypes.INTEGER, allowNull: true },
      'createdAt': { type: DataTypes.DATE },
      'updatedAt': { type: DataTypes.DATE }
    };

    console.log('\n📦 Adding missing columns to assets table...\n');
    let addedCount = 0;
    
    for (const [columnName, columnDef] of Object.entries(requiredColumns)) {
      if (!assetColumns[columnName]) {
        try {
          await queryInterface.addColumn('assets', columnName, columnDef);
          console.log(`   ✅ Added ${columnName}`);
          addedCount++;
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`   ℹ️  ${columnName} already exists`);
          } else {
            console.warn(`   ⚠️  Could not add ${columnName}: ${error.message}`);
          }
        }
      }
    }
    
    if (addedCount === 0) {
      console.log('   ℹ️  All required columns already exist');
    }
    
    console.log(`\n✅ Assets table fix complete (${addedCount} columns added)`);
    console.log('\n💡 Restart the backend to apply changes');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAssetsTable();
