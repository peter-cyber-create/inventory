#!/usr/bin/env node

/**
 * Fix Assets Table Schema
 * Adds missing foreign key columns to assets table and creates missing tables
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

async function fixSchema() {
  try {
    console.log('🔧 Fixing database schema...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    const queryInterface = sequelize.getQueryInterface();

    // Check if staff table exists, create if not
    const [staffExists] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'staff'
      );
    `);
    
    if (!staffExists[0].exists) {
      console.log('📦 Creating staff table...');
      await queryInterface.createTable('staff', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING },
        phoneno: { type: DataTypes.STRING },
        title: { type: DataTypes.STRING, allowNull: false },
        deptId: { type: DataTypes.INTEGER, references: { model: 'depart', key: 'id' } },
        divisionId: { type: DataTypes.INTEGER, references: { model: 'division', key: 'id' } },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE }
      });
      console.log('✅ staff table created');
    } else {
      console.log('✅ staff table exists');
    }

    // Check assets table columns
    console.log('\n🔍 Checking assets table structure...');
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'assets'
      ORDER BY ordinal_position;
    `);

    const existingColumns = columns.map(c => c.column_name);
    console.log(`   Found ${existingColumns.length} columns in assets table`);

    // Add missing foreign key columns to assets table
    const requiredColumns = {
      typeId: { type: DataTypes.INTEGER, references: { model: 'type', key: 'id' }, allowNull: true },
      categoryId: { type: DataTypes.INTEGER, references: { model: 'category', key: 'id' }, allowNull: true },
      brandId: { type: DataTypes.INTEGER, references: { model: 'brand', key: 'id' }, allowNull: true },
      modelId: { type: DataTypes.INTEGER, references: { model: 'model', key: 'id' }, allowNull: true },
      staffId: { type: DataTypes.INTEGER, references: { model: 'staff', key: 'id' }, allowNull: true }
    };

    for (const [colName, colDef] of Object.entries(requiredColumns)) {
      if (!existingColumns.includes(colName)) {
        console.log(`📦 Adding ${colName} column to assets table...`);
        try {
          await queryInterface.addColumn('assets', colName, {
            type: DataTypes.INTEGER,
            allowNull: true, // Allow null initially so existing rows don't break
            references: colDef.references
          });
          console.log(`✅ ${colName} column added`);
        } catch (error) {
          console.log(`⚠️  Could not add ${colName}: ${error.message}`);
        }
      } else {
        console.log(`✅ ${colName} column exists`);
      }
    }

    // Check if maintenances table exists
    const [maintenanceExists] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND (table_name = 'maintenances' OR table_name = 'maintenance')
      );
    `);
    
    if (!maintenanceExists[0].exists) {
      console.log('\n📦 Creating maintenances table...');
      await queryInterface.createTable('maintenances', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        assetId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'assets', key: 'id' } },
        taskName: { type: DataTypes.STRING, allowNull: false },
        servicedOn: { type: DataTypes.DATE },
        servicedBy: { type: DataTypes.STRING },
        nextService: { type: DataTypes.DATE },
        cost: { type: DataTypes.DOUBLE },
        notes: { type: DataTypes.TEXT },
        user: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE }
      });
      console.log('✅ maintenances table created');
    } else {
      console.log('✅ maintenances table exists');
    }

    // Create a default staff member if staff table is empty
    const [staffCount] = await sequelize.query(`SELECT COUNT(*) as count FROM staff;`);
    if (parseInt(staffCount[0].count) === 0) {
      console.log('\n📦 Creating default staff member...');
      await sequelize.query(`
        INSERT INTO staff (name, email, title, "deptId", "divisionId", "createdAt", "updatedAt")
        VALUES ('System Staff', 'staff@moh.go.ug', 'System User', 1, 1, NOW(), NOW())
        ON CONFLICT DO NOTHING;
      `);
      console.log('✅ Default staff created');
    }

    // Create default type, category, brand, model if they don't exist
    console.log('\n📦 Creating default category data...');
    
    // Default type
    const [typeCount] = await sequelize.query(`SELECT COUNT(*) as count FROM type;`);
    if (parseInt(typeCount[0].count) === 0) {
      await sequelize.query(`
        INSERT INTO type (name, description, "createdAt", "updatedAt")
        VALUES ('ICT Equipment', 'Information and Communication Technology Equipment', NOW(), NOW())
        ON CONFLICT DO NOTHING;
      `);
      console.log('✅ Default type created');
    }

    // Default brand
    const [brandCount] = await sequelize.query(`SELECT COUNT(*) as count FROM brand;`);
    if (parseInt(brandCount[0].count) === 0) {
      await sequelize.query(`
        INSERT INTO brand (name, description, "createdAt", "updatedAt")
        VALUES ('Generic', 'Generic Brand', NOW(), NOW())
        ON CONFLICT DO NOTHING;
      `);
      console.log('✅ Default brand created');
    }

    // Default category (needs typeId)
    const [categoryCount] = await sequelize.query(`SELECT COUNT(*) as count FROM category;`);
    if (parseInt(categoryCount[0].count) === 0) {
      await sequelize.query(`
        INSERT INTO category (name, "typeId", description, "createdAt", "updatedAt")
        SELECT 'Computer', id, 'Computer Equipment', NOW(), NOW()
        FROM type WHERE name = 'ICT Equipment' LIMIT 1
        ON CONFLICT DO NOTHING;
      `);
      console.log('✅ Default category created');
    }

    // Default model (needs categoryId and brandId)
    const [modelCount] = await sequelize.query(`SELECT COUNT(*) as count FROM model;`);
    if (parseInt(modelCount[0].count) === 0) {
      await sequelize.query(`
        INSERT INTO model (name, "categoryId", "brandId", description, "createdAt", "updatedAt")
        SELECT 'Generic Model', c.id, b.id, 'Generic Model', NOW(), NOW()
        FROM category c, brand b
        WHERE c.name = 'Computer' AND b.name = 'Generic'
        LIMIT 1
        ON CONFLICT DO NOTHING;
      `);
      console.log('✅ Default model created');
    }

    console.log('\n✅ Schema fixes complete!');
    console.log('\n💡 The system should now be able to load assets and maintenance records.');
    console.log('   Restart the backend: pm2 restart moh-ims-backend\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.original) {
      console.error('   Original:', error.original.message);
    }
    console.error(error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

fixSchema();

