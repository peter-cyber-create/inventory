#!/usr/bin/env node

/**
 * Direct migration runner that uses environment variables
 * Bypasses Sequelize config.json and uses env vars directly
 */

require('dotenv').config({ path: '../config/environments/backend.env' });

const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');

// Get database credentials from environment
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'inventory_db',
  username: process.env.DB_USER || 'inventory_user',
  password: process.env.DB_PASS,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};

// Validate required variables
if (!dbConfig.password) {
  console.error('❌ Error: DB_PASS is not set in backend.env');
  process.exit(1);
}

console.log('🔄 Running database migrations...');
console.log(`   Database: ${dbConfig.database}`);
console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
console.log(`   User: ${dbConfig.username}`);
console.log('');

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
});

// Configure Umzug for migrations
const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, 'migrations'),
    params: [
      sequelize.getQueryInterface(),
      Sequelize,
    ],
  },
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },
});

// Run migrations
(async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Get pending migrations
    const pending = await umzug.pending();
    if (pending.length === 0) {
      console.log('✅ No pending migrations');
    } else {
      console.log(`📦 Found ${pending.length} pending migration(s)`);
    }

    // Run migrations
    const executed = await umzug.up();
    console.log(`✅ Executed ${executed.length} migration(s)`);

    // Show status
    const executedMigrations = await umzug.executed();
    console.log(`📊 Total executed migrations: ${executedMigrations.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    if (error.original) {
      console.error('   Original error:', error.original.message);
    }
    process.exit(1);
  } finally {
    await sequelize.close();
  }
})();

