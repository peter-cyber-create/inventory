#!/usr/bin/env node

/**
 * Test Asset Creation Script
 * Tests if asset creation endpoint works correctly
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/environments/backend.env') });

const { sequelize } = require('../backend/config/db');
const Asset = require('../backend/models/assets/assetsModel');
const Type = require('../backend/models/categories/typeModel');
const Category = require('../backend/models/categories/categoryModel');
const Brand = require('../backend/models/categories/brandModel');
const Model = require('../backend/models/categories/model');

async function testAssetCreation() {
  try {
    console.log('🧪 Testing asset creation...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Get defaults
    const [defaultType] = await Type.findAll({ limit: 1 });
    const [defaultCategory] = await Category.findAll({ limit: 1 });
    const [defaultBrand] = await Brand.findAll({ limit: 1 });
    const [defaultModel] = await Model.findAll({ limit: 1 });

    console.log('📦 Default IDs:');
    console.log(`   Type: ${defaultType?.id || 'NONE'}`);
    console.log(`   Category: ${defaultCategory?.id || 'NONE'}`);
    console.log(`   Brand: ${defaultBrand?.id || 'NONE'}`);
    console.log(`   Model: ${defaultModel?.id || 'NONE'}\n`);

    // Test asset data (simulating form submission)
    const testAssetData = {
      description: 'Test ICT Asset',
      serialNo: 'TEST-001',
      engravedNo: 'ENG-001',
      funding: 'GOU',
      status: 'InStores',
      typeId: defaultType?.id || null,
      categoryId: defaultCategory?.id || null,
      brandId: defaultBrand?.id || null,
      modelId: defaultModel?.id || null,
      staffId: null // Will be set to default if available
    };

    console.log('📝 Attempting to create test asset...');
    console.log('   Data:', JSON.stringify(testAssetData, null, 2));

    const asset = await Asset.create(testAssetData);
    console.log(`\n✅ Asset created successfully!`);
    console.log(`   ID: ${asset.id}`);
    console.log(`   Description: ${asset.description}`);
    console.log(`   Status: ${asset.status}\n`);

    // Clean up test asset
    await Asset.destroy({ where: { id: asset.id } });
    console.log('🧹 Test asset cleaned up\n');

    console.log('✅ Asset creation test PASSED!\n');
    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Asset creation test FAILED!');
    console.error('   Error:', error.message);
    if (error.errors) {
      console.error('   Validation errors:');
      error.errors.forEach(e => {
        console.error(`     - ${e.path}: ${e.message}`);
      });
    }
    if (error.original) {
      console.error('   Original error:', error.original.message);
    }
    await sequelize.close();
    process.exit(1);
  }
}

testAssetCreation();

