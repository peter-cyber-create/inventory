#!/usr/bin/env node

/**
 * Add Missing Columns Script
 * Adds missing columns that models expect but tables don't have
 */

const path = require('path');

// Add backend node_modules to NODE_PATH
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

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing columns...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    const queryInterface = sequelize.getQueryInterface();

    // Check assets table columns
    const [assetColumns] = await sequelize.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_name = 'assets';
    `);
    const assetColNames = assetColumns.map(c => c.column_name);

    // Add missing columns to assets table
    const assetsColumnsToAdd = {
      supplier: { type: DataTypes.STRING, allowNull: true },
      funding: { type: DataTypes.STRING, allowNull: true },
      funder: { type: DataTypes.STRING, allowNull: true },
      purchaseCost: { type: DataTypes.DOUBLE, allowNull: true },
      purchaseDate: { type: DataTypes.DATE, allowNull: true },
      warrantly: { type: DataTypes.STRING, allowNull: true },
      estimatedCost: { type: DataTypes.STRING, allowNull: true },
      requisition: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      storesdispatch: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      itissue: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      isdisposed: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
      status: { type: DataTypes.STRING, allowNull: true, defaultValue: 'InStores' }
    };

    console.log('📦 Checking assets table columns...');
    for (const [colName, colDef] of Object.entries(assetsColumnsToAdd)) {
      // Check both camelCase and snake_case
      const camelCase = colName;
      const snakeCase = colName.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      if (!assetColNames.includes(camelCase) && !assetColNames.includes(snakeCase)) {
        console.log(`   Adding ${colName}...`);
        try {
          await queryInterface.addColumn('assets', colName, colDef);
          console.log(`   ✅ ${colName} added`);
        } catch (error) {
          console.log(`   ⚠️  Could not add ${colName}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${colName} exists`);
      }
    }

    // Check maintenances table columns
    const [maintenanceColumns] = await sequelize.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_name = 'maintenances';
    `);
    const maintenanceColNames = maintenanceColumns.map(c => c.column_name);

    // Add missing columns to maintenances table
    const maintenanceColumnsToAdd = {
      description: { type: DataTypes.TEXT, allowNull: true },
      cost: { type: DataTypes.DOUBLE, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      user: { type: DataTypes.STRING, allowNull: true }
    };

    console.log('\n📦 Checking maintenances table columns...');
    for (const [colName, colDef] of Object.entries(maintenanceColumnsToAdd)) {
      if (!maintenanceColNames.includes(colName)) {
        console.log(`   Adding ${colName}...`);
        try {
          await queryInterface.addColumn('maintenances', colName, colDef);
          console.log(`   ✅ ${colName} added`);
        } catch (error) {
          console.log(`   ⚠️  Could not add ${colName}: ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${colName} exists`);
      }
    }

    console.log('\n✅ All missing columns added!');
    console.log('   Restart backend: pm2 restart moh-ims-backend\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.original) {
      console.error('   Original:', error.original.message);
    }
    await sequelize.close();
    process.exit(1);
  }
}

addMissingColumns();

