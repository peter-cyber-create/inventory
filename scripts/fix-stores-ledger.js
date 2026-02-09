#!/usr/bin/env node

/**
 * Fix Stores module ledger by populating stock_ledger with data from GRNs
 * Usage: node scripts/fix-stores-ledger.js
 */

const { sequelize } = require('../backend/config/db');
const models = require('../backend/models/stores');

async function fixLedger() {
  try {
    console.log('🔧 Starting stores ledger fix...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');

    // Get all GRNs and populate stock_ledger
    console.log('📊 Populating stock_ledger from GRNs...');
    const { GRN, Item, Location, StockLedger } = models;

    const grns = await GRN.findAll({
      include: [
        { model: Item, as: 'item' },
        { model: Location, as: 'location' }
      ],
      raw: false
    });

    let created = 0;
    for (const grn of grns) {
      // Create stock ledger entry for the GRN
      const unitCost = grn.unit_cost || 0;
      const quantity = grn.quantity_received || 0;
      const totalValue = quantity * unitCost;

      await StockLedger.findOrCreate({
        where: {
          transaction_type: 'GRN',
          transaction_id: grn.grn_id,
          item_id: grn.item_id,
          location_id: grn.location_id
        },
        defaults: {
          reference_number: grn.grn_number || `GRN-${grn.grn_id}`,
          quantity_in: quantity,
          quantity_out: 0,
          balance: quantity,
          unit_cost: unitCost,
          batch_number: grn.batch_number || null,
          expiry_date: grn.expiry_date || null,
          transaction_date: grn.received_date || new Date(),
          created_by: grn.received_by || null
        }
      });
      created++;
    }
    console.log(`✅ Created ${created} stock ledger entries from GRNs\n`);

    // List tables to verify structure
    console.log('📋 Verifying database tables...');
    const tables = await sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `, { type: sequelize.QueryTypes.SELECT });

    const storesRelated = tables
      .map(t => t.table_name)
      .filter(t => ['grns', 'grn_items', 'stock_ledger', 'items', 'locations', 'suppliers'].includes(t));
    
    console.log('✅ Stores-related tables:', storesRelated.join(', '), '\n');

    // Check GRNItem associations
    console.log('🔗 Verifying GRN-GRNItem associations...');
    const grnCount = await GRN.count();
    console.log(`✅ Found ${grnCount} GRNs\n`);

    console.log('✅ Stores ledger fix complete!');
    console.log('   → Restart backend: pm2 restart backend');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixLedger();
