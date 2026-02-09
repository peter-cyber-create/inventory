#!/usr/bin/env node

/**
 * Direct SQL Database Setup
 * Applies all necessary schema changes directly without waiting for migrations
 */

const pg = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/environments/backend.env') });

const client = new pg.Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // List of SQL commands to execute
    const sqlCommands = [
      // 1. Create activities table if not exists
      `CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        "activityName" VARCHAR(255),
        requested_by VARCHAR(255),
        dept VARCHAR(255),
        funder VARCHAR(255),
        status VARCHAR(255) NOT NULL DEFAULT 'pending_accountability',
        "startDate" TIMESTAMP,
        "endDate" TIMESTAMP,
        "reportPath" VARCHAR(255),
        "createdBy" INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 2. Create servers table if not exists
      `CREATE TABLE IF NOT EXISTS servers (
        id SERIAL PRIMARY KEY,
        "serialNo" VARCHAR(255),
        "serverName" VARCHAR(255),
        "IP" VARCHAR(255),
        brand VARCHAR(255),
        memory VARCHAR(255),
        processor VARCHAR(255),
        "storageInfo" VARCHAR(255),
        "hostName" VARCHAR(255),
        "location" VARCHAR(255),
        "status" VARCHAR(255),
        "assignedTo" INTEGER REFERENCES staff(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,

      // 3. Add missing column to requisitions if not exists
      `DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'requisitions' AND column_name = 'department_id'
        ) THEN
          ALTER TABLE requisitions ADD COLUMN department_id INTEGER REFERENCES depart(id) ON DELETE SET NULL;
        END IF;
      END $$;`,
    ];

    for (let i = 0; i < sqlCommands.length; i++) {
      console.log(`⏳ Executing SQL command ${i + 1}/${sqlCommands.length}...`);
      try {
        await client.query(sqlCommands[i]);
        console.log(`✅ Command ${i + 1} completed\n`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`ℹ️  Table/column already exists - skipping\n`);
        } else {
          throw err;
        }
      }
    }

    // Verify tables exist
    console.log('🔍 Verifying tables...\n');
    const tables = ['activities', 'servers', 'requisitions'];
    for (const tableName of tables) {
      const result = await client.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );`,
        [tableName]
      );
      if (result.rows[0].exists) {
        console.log(`✅ ${tableName} table exists`);
      } else {
        console.log(`❌ ${tableName} table NOT found`);
      }
    }

    console.log('\n✅ Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
