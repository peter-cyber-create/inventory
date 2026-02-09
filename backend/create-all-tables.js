#!/usr/bin/env node

/**
 * Create all database tables by syncing Sequelize models
 * This will create tables that match the model definitions
 */

require('dotenv').config({ path: '../config/environments/backend.env' });
const { sequelize } = require('./config/db');

// Import all models to register them
require('./models/categories/typeModel');
require('./models/categories/categoryModel');
require('./models/categories/brandModel');
require('./models/categories/model');
require('./models/categories/staffModel');
require('./models/categories/departmentModel');
require('./models/categories/divisions');
require('./models/categories/facilityModel');
require('./models/assets/assetsModel');
require('./models/server/serverModel');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');
    
    console.log('🔄 Creating/Syncing all tables...\n');
    
    // Sync all models (create tables if they don't exist)
    // Use { alter: true } to update existing tables, or { force: false } to only create missing ones
    await sequelize.sync({ alter: false, force: false });
    
    console.log('✅ All tables created/synced successfully!\n');
    
    // List all tables
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log(`📊 Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`   - ${t.table_name}`));
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.original) {
      console.error('   Original:', error.original.message);
    }
    process.exit(1);
  }
})();
