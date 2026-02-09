#!/usr/bin/env node

/**
 * Final Database Fix - Applies all missing migrations and column fixes
 * Ensures activities table exists, adds missing columns, and runs all migrations
 */

const Sequelize = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/environments/backend.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: (msg) => console.log(`📊 ${msg}`),
  }
);

async function fixDatabase() {
  try {
    console.log('\n🔧 Starting Final Database Fix...\n');

    // 1. Test connection
    console.log('1️⃣ Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    // 2. Check and run migrations
    console.log('2️⃣ Running pending migrations...');
    const queryInterface = sequelize.getQueryInterface();
    
    // Use umzug to run migrations
    const { Umzug } = require('umzug');
    const umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, 'migrations/*.js'),
        resolve: ({ name, path: filePath }) => ({
          name,
          up: async () => {
            const migration = require(filePath);
            return migration.up(queryInterface, Sequelize);
          },
          down: async () => {
            const migration = require(filePath);
            return migration.down(queryInterface, Sequelize);
          },
        }),
      },
      context: queryInterface,
      storage: new (require('umzug').SequelizeStorage)({ sequelize }),
      logger: console,
    });

    const pendingMigrations = await umzug.pending();
    if (pendingMigrations.length > 0) {
      console.log(`Found ${pendingMigrations.length} pending migration(s):`);
      pendingMigrations.forEach(m => console.log(`  - ${m.name}`));
      await umzug.up();
      console.log('✅ Migrations executed\n');
    } else {
      console.log('✅ No pending migrations\n');
    }

    // 3. Check if activities table exists
    console.log('3️⃣ Checking activities table...');
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('activities')) {
      console.log('⚠️  Activities table missing - creating...');
      await queryInterface.createTable('activities', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        activityName: {
          type: Sequelize.STRING,
        },
        requested_by: {
          type: Sequelize.STRING,
        },
        dept: {
          type: Sequelize.STRING,
        },
        funder: {
          type: Sequelize.STRING,
        },
        status: {
          type: Sequelize.STRING,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      });
      console.log('✅ Activities table created\n');
    } else {
      console.log('✅ Activities table exists\n');
    }

    // 4. Check and add missing columns
    console.log('4️⃣ Checking and adding missing columns...');
    
    // Check requisitions.department_id
    const reqColumns = await queryInterface.describeTable('requisitions');
    if (!reqColumns.department_id) {
      console.log('   Adding requisitions.department_id...');
      await queryInterface.addColumn('requisitions', 'department_id', {
        type: Sequelize.INTEGER,
        references: { model: 'depart', key: 'id' },
        onDelete: 'SET NULL',
      });
      console.log('   ✅ Added requisitions.department_id');
    } else {
      console.log('   ✅ requisitions.department_id already exists');
    }

    console.log('✅ All column checks completed\n');

    // 5. Verify key tables exist
    console.log('5️⃣ Verifying critical tables...');
    const tablesNeeded = ['activities', 'servers', 'requisitions', 'users', 'ledger'];
    const finaltables = await queryInterface.showAllTables();
    let allExists = true;
    tablesNeeded.forEach(t => {
      if (finaltables.includes(t)) {
        console.log(`   ✅ ${t}`);
      } else {
        console.log(`   ❌ ${t} MISSING`);
        allExists = false;
      }
    });

    if (allExists) {
      console.log('\n✅ All critical tables exist and database fixes applied!\n');
      process.exit(0);
    } else {
      console.log('\n❌ Some critical tables are still missing\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Database fix failed:');
    console.error(error.message);
    if (error.original) {
      console.error('Original error:', error.original.message);
    }
    process.exit(1);
  }
}

fixDatabase();
