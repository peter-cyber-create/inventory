const { sequelize } = require('../config/db');

const GRN = require('../models/stores/grnModel');
const GRNItem = require('../models/stores/grnItemModel');
const GRNAttachment = require('../models/stores/grnAttachmentModel');
const GRNSignature = require('../models/stores/grnSignatureModel');
const Ledger = require('../models/stores/ledgerModel');
const LedgerTransaction = require('../models/stores/ledgerTransactionModel');
const Requisition = require('../models/stores/requisitionModel');
const RequisitionItem = require('../models/stores/requisitionItemModel');
const RequisitionSignature = require('../models/stores/requisitionSignatureModel');

async function verifyStoresTables() {
  try {
    console.log('🔍 Checking stores tables...');
    
    // Check if tables exist
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('grns', 'grn_items', 'grn_attachments', 'grn_signatures', 'ledgers', 'ledger_transactions', 'requisitions', 'requisition_items', 'requisition_signatures')
    `);
    
    const existingTables = results.map(r => r.table_name);
    const requiredTables = [
      'grns', 'grn_items', 'grn_attachments', 'grn_signatures',
      'ledgers', 'ledger_transactions',
      'requisitions', 'requisition_items', 'requisition_signatures'
    ];
    
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log(`⚠️  Missing tables: ${missingTables.join(', ')}`);
      console.log('📝 Creating missing tables...');
      
      // Create tables one by one
      if (missingTables.includes('grns')) {
        await GRN.sync({ force: false });
        console.log('✅ Created grns table');
      }
      
      if (missingTables.includes('grn_items')) {
        await GRNItem.sync({ force: false });
        console.log('✅ Created grn_items table');
      }
      
      if (missingTables.includes('grn_attachments')) {
        await GRNAttachment.sync({ force: false });
        console.log('✅ Created grn_attachments table');
      }
      
      if (missingTables.includes('grn_signatures')) {
        await GRNSignature.sync({ force: false });
        console.log('✅ Created grn_signatures table');
      }
      
      if (missingTables.includes('ledgers')) {
        await Ledger.sync({ force: false });
        console.log('✅ Created ledgers table');
      }
      
      if (missingTables.includes('ledger_transactions')) {
        await LedgerTransaction.sync({ force: false });
        console.log('✅ Created ledger_transactions table');
      }
      
      if (missingTables.includes('requisitions')) {
        await Requisition.sync({ force: false });
        console.log('✅ Created requisitions table');
      }
      
      if (missingTables.includes('requisition_items')) {
        await RequisitionItem.sync({ force: false });
        console.log('✅ Created requisition_items table');
      }
      
      if (missingTables.includes('requisition_signatures')) {
        await RequisitionSignature.sync({ force: false });
        console.log('✅ Created requisition_signatures table');
      }
      
      console.log('✅ All stores tables created successfully!');
    } else {
      console.log('✅ All stores tables exist');
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error verifying stores tables:', error.message);
    process.exit(1);
  }
}

verifyStoresTables();
