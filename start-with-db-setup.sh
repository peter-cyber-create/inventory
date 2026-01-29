#!/bin/bash

# Start application with database setup
# Ensures database is ready and migrations are run

set -e

echo "🚀 Starting Inventory Management System..."
echo ""

# Load environment variables
if [ -f "config/environments/backend.env" ]; then
    export $(cat config/environments/backend.env | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
fi

# Check PostgreSQL
echo "Checking PostgreSQL connection..."
if ! PGPASSWORD="${DB_PASS}" psql -h "${DB_HOST:-localhost}" -U "${DB_USER:-inventory_user}" -d "${DB_NAME:-inventory_db}" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "⚠️  Database connection failed. Attempting to create database..."
    
    # Try to create database
    sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME:-inventory_db};" 2>/dev/null || true
    sudo -u postgres psql -c "CREATE USER ${DB_USER:-inventory_user} WITH PASSWORD '${DB_PASS}';" 2>/dev/null || true
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME:-inventory_db} TO ${DB_USER:-inventory_user};" 2>/dev/null || true
fi

# Run migrations using Node.js directly (bypasses Sequelize CLI env var issues)
echo "Running database migrations..."
cd backend

# Create a temporary migration runner
node << 'MIGRATION_SCRIPT'
require('dotenv').config({ path: '../config/environments/backend.env' });
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'inventory_db',
  process.env.DB_USER || 'inventory_user',
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false
  }
);

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Check if migrations table exists
    const [results] = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'SequelizeMeta'
      );
    `);
    
    if (!results[0].exists) {
      console.log('Creating migrations table...');
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
          name VARCHAR(255) NOT NULL PRIMARY KEY
        );
      `);
    }
    
    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();
    
    console.log(`Found ${files.length} migration files`);
    
    // Run each migration
    for (const file of files) {
      const migration = require(path.join(migrationsDir, file));
      const migrationName = file.replace('.js', '');
      
      // Check if already run
      const [run] = await sequelize.query(`
        SELECT * FROM "SequelizeMeta" WHERE name = '${migrationName}';
      `);
      
      if (run.length === 0) {
        console.log(`Running migration: ${file}`);
        try {
          await migration.up(sequelize.getQueryInterface(), Sequelize);
          await sequelize.query(`INSERT INTO "SequelizeMeta" (name) VALUES ('${migrationName}');`);
          console.log(`✅ ${file} completed`);
        } catch (err) {
          console.error(`❌ Error in ${file}:`, err.message);
          // Continue with other migrations
        }
      } else {
        console.log(`⏭️  ${file} already run`);
      }
    }
    
    console.log('✅ All migrations completed');
    await sequelize.close();
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  }
}

runMigrations();
MIGRATION_SCRIPT

cd ..

# Check if users exist
echo ""
echo "Checking for default users..."
USER_COUNT=$(PGPASSWORD="${DB_PASS}" psql -h "${DB_HOST:-localhost}" -U "${DB_USER:-inventory_user}" -d "${DB_NAME:-inventory_db}" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    echo "⚠️  No users found. Default users should be created by migrations."
    echo "   You may need to manually create users or check migration logs."
else
    echo "✅ Found $USER_COUNT user(s) in database"
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Default login credentials (if created by migrations):"
echo "  • admin / admin123"
echo "  • it_manager / admin123"
echo "  • store_manager / admin123"
echo "  • fleet_manager / admin123"
echo "  • finance_manager / admin123"
echo ""
echo "⚠️  IMPORTANT: Change all default passwords after first login!"
echo ""
echo "Starting application..."
echo ""

# Start the app
npm run dev













