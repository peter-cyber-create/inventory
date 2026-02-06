/**
 * Create servers table if it doesn't exist
 * Run this on the server: node scripts/create-servers-table.js
 */

const path = require('path');
const { sequelize } = require('../backend/config/db.js');
const ServerModel = require('../backend/models/server/serverModel.js');

async function createServersTable() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connection established');

        console.log('🔄 Creating servers table...');
        // Use sync with alter: false to create table if it doesn't exist
        // This is safe because it only creates, doesn't modify existing structure
        await ServerModel.sync({ alter: false });
        console.log('✅ Servers table created or already exists');

        console.log('✅ Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating servers table:', error.message);
        if (error.message.includes('relation "servers" already exists')) {
            console.log('ℹ️  Table already exists, nothing to do.');
            process.exit(0);
        }
        process.exit(1);
    }
}

createServersTable();
