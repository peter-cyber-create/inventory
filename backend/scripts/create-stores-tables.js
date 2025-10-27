const { sequelize } = require('../config/db');

async function createStoresTables() {
  try {
    console.log('Creating stores tables...');

    // Create requisitions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS requisitions (
        id SERIAL PRIMARY KEY,
        serial_no VARCHAR(255) UNIQUE,
        requisition_number VARCHAR(255),
        form_date DATE,
        requisition_date DATE,
        from_department VARCHAR(255),
        department VARCHAR(255),
        to_store VARCHAR(255),
        destination VARCHAR(255),
        purpose VARCHAR(500),
        purpose_remarks TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Created requisitions table');

    // Create requisition_items table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS requisition_items (
        id SERIAL PRIMARY KEY,
        requisition_id INTEGER NOT NULL,
        serial_no INTEGER,
        description TEXT,
        unit_of_issue VARCHAR(100),
        unit VARCHAR(100),
        quantity_ordered INTEGER DEFAULT 0,
        qty_ordered INTEGER DEFAULT 0,
        quantity_approved INTEGER DEFAULT 0,
        qty_approved INTEGER DEFAULT 0,
        quantity_issued INTEGER DEFAULT 0,
        qty_issued INTEGER DEFAULT 0,
        quantity_received INTEGER DEFAULT 0,
        qty_received INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_requisition FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created requisition_items table');

    // Create requisition_signatures table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS requisition_signatures (
        id SERIAL PRIMARY KEY,
        requisition_id INTEGER NOT NULL,
        role VARCHAR(100),
        name VARCHAR(255),
        signature TEXT,
        signed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_requisition_sig FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created requisition_signatures table');

    // Create grns table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS grns (
        id SERIAL PRIMARY KEY,
        grn_no VARCHAR(255) UNIQUE,
        date_received DATE,
        delivery_note_no VARCHAR(255),
        tax_invoice_no VARCHAR(255),
        lpo_no VARCHAR(255),
        contract_no VARCHAR(255),
        supplier_name VARCHAR(255),
        supplier_contact VARCHAR(255),
        delivery_location VARCHAR(255),
        remarks TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Created grns table');

    // Create grn_items table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS grn_items (
        id SERIAL PRIMARY KEY,
        grn_id INTEGER NOT NULL,
        serial_no INTEGER,
        description TEXT,
        unit_of_measure VARCHAR(100),
        qty_ordered INTEGER DEFAULT 0,
        qty_delivered INTEGER DEFAULT 0,
        qty_accepted INTEGER DEFAULT 0,
        unit_price DECIMAL(10, 2),
        total_value DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_grn FOREIGN KEY (grn_id) REFERENCES grns(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created grn_items table');

    // Create grn_attachments table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS grn_attachments (
        id SERIAL PRIMARY KEY,
        grn_id INTEGER NOT NULL,
        file_path VARCHAR(500),
        file_type VARCHAR(50),
        uploaded_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_grn_attachment FOREIGN KEY (grn_id) REFERENCES grns(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created grn_attachments table');

    // Create grn_signatures table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS grn_signatures (
        id SERIAL PRIMARY KEY,
        grn_id INTEGER NOT NULL,
        role VARCHAR(100),
        name VARCHAR(255),
        signature TEXT,
        signed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_grn_signature FOREIGN KEY (grn_id) REFERENCES grns(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created grn_signatures table');

    // Create ledgers table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ledgers (
        id SERIAL PRIMARY KEY,
        ledger_id VARCHAR(255) UNIQUE,
        date_of_transaction DATE,
        reference_document_type VARCHAR(100),
        reference_document_no VARCHAR(255),
        item_description TEXT,
        item_code VARCHAR(255),
        unit_of_issue VARCHAR(100),
        quantity_received INTEGER DEFAULT 0,
        quantity_issued INTEGER DEFAULT 0,
        balance_on_hand INTEGER DEFAULT 0,
        unit_cost DECIMAL(10, 2),
        total_value DECIMAL(10, 2),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Created ledgers table');

    // Create ledger_transactions table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ledger_transactions (
        id SERIAL PRIMARY KEY,
        ledger_id INTEGER NOT NULL,
        operation_type VARCHAR(100),
        user_id INTEGER,
        operation_details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_ledger_transaction FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created ledger_transactions table');

    console.log('\n✅ All stores tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error.message);
  }
  
  process.exit(0);
}

createStoresTables();
