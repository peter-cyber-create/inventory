#!/usr/bin/env node

/**
 * Force Create Missing Tables Script
 * Creates missing tables directly if migrations are out of sync
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
    logging: console.log
  }
);

async function createMissingTables() {
  try {
    console.log('🔍 Checking and creating missing tables...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    const queryInterface = sequelize.getQueryInterface();

    // Check and create type table
    const [typeExists] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'type'
      );
    `);
    
    if (!typeExists[0].exists) {
      console.log('📦 Creating type table...');
      await queryInterface.createTable('type', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE }
      });
      console.log('✅ type table created');
    } else {
      console.log('✅ type table exists');
    }

    // Check and create brand table
    const [brandExists] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'brand'
      );
    `);
    
    if (!brandExists[0].exists) {
      console.log('📦 Creating brand table...');
      await queryInterface.createTable('brand', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE }
      });
      console.log('✅ brand table created');
    } else {
      console.log('✅ brand table exists');
    }

    // Check and create category table
    const [categoryExists] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'category'
      );
    `);
    
    if (!categoryExists[0].exists) {
      console.log('📦 Creating category table...');
      await queryInterface.createTable('category', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        typeId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'type', key: 'id' } },
        description: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE }
      });
      console.log('✅ category table created');
    } else {
      console.log('✅ category table exists');
    }

    // Check and create model table
    const [modelExists] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'model'
      );
    `);
    
    if (!modelExists[0].exists) {
      console.log('📦 Creating model table...');
      await queryInterface.createTable('model', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING },
        categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'category', key: 'id' } },
        brandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'brand', key: 'id' } },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE }
      });
      console.log('✅ model table created');
    } else {
      console.log('✅ model table exists');
    }

    // Check and create facilities table
    const [facilitiesExists] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'facilities'
      );
    `);
    
    if (!facilitiesExists[0].exists) {
      console.log('📦 Creating facilities table...');
      await queryInterface.createTable('facilities', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        code: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE }
      });
      console.log('✅ facilities table created');
    } else {
      console.log('✅ facilities table exists');
    }

    console.log('\n✅ Critical tables check complete!');
    console.log('\n💡 Note: Other tables (stores, vehicles, etc.) will be created by their respective migrations.');
    console.log('   Run: cd backend && npx sequelize-cli db:migrate\n');

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

createMissingTables();

