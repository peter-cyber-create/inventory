#!/usr/bin/env node

/**
 * Make Asset Foreign Keys Nullable
 * Allows assets to be created without requiring all foreign keys immediately
 */

const path = require('path');

// Add backend node_modules to NODE_PATH
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

async function makeNullable() {
  try {
    console.log('🔧 Making asset foreign keys nullable...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Get default IDs for fallback
    const [defaultType] = await sequelize.query(`SELECT id FROM type LIMIT 1;`);
    const [defaultCategory] = await sequelize.query(`SELECT id FROM category LIMIT 1;`);
    const [defaultBrand] = await sequelize.query(`SELECT id FROM brand LIMIT 1;`);
    const [defaultModel] = await sequelize.query(`SELECT id FROM model LIMIT 1;`);
    const [defaultStaff] = await sequelize.query(`SELECT id FROM staff LIMIT 1;`);

    const defaults = {
      typeId: defaultType.length > 0 ? defaultType[0].id : null,
      categoryId: defaultCategory.length > 0 ? defaultCategory[0].id : null,
      brandId: defaultBrand.length > 0 ? defaultBrand[0].id : null,
      modelId: defaultModel.length > 0 ? defaultModel[0].id : null,
      staffId: defaultStaff.length > 0 ? defaultStaff[0].id : null
    };

    console.log('📦 Default IDs:', defaults);

    // Update existing NULL values to use defaults
    for (const [colName, defaultValue] of Object.entries(defaults)) {
      if (defaultValue !== null) {
        console.log(`   Setting NULL ${colName} to ${defaultValue}...`);
        await sequelize.query(`
          UPDATE assets 
          SET "${colName}" = ${defaultValue} 
          WHERE "${colName}" IS NULL;
        `);
      }
    }

    // Alter columns to allow NULL
    const columns = ['typeId', 'categoryId', 'brandId', 'modelId', 'staffId'];
    
    for (const colName of columns) {
      console.log(`\n📦 Making ${colName} nullable...`);
      try {
        // First, set default value for any NULLs
        if (defaults[colName] !== null) {
          await sequelize.query(`
            UPDATE assets SET "${colName}" = ${defaults[colName]} WHERE "${colName}" IS NULL;
          `);
        }
        
        // Then alter column to allow NULL
        await sequelize.query(`
          ALTER TABLE assets 
          ALTER COLUMN "${colName}" DROP NOT NULL;
        `);
        console.log(`   ✅ ${colName} is now nullable`);
      } catch (error) {
        console.log(`   ⚠️  ${colName}: ${error.message}`);
      }
    }

    console.log('\n✅ Foreign keys are now nullable!');
    console.log('   Assets can now be created without requiring all foreign keys.\n');

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

makeNullable();

