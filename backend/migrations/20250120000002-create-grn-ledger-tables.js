'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if users table exists (required for foreign keys)
    const usersExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users');",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (!usersExists[0].exists) {
      console.log('⚠️  users table does not exist yet. Skipping this migration.');
      return;
    }

    // Create GRN table
    await queryInterface.createTable('grns', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      grn_no: {
        type: Sequelize.STRING(30),
        unique: true,
        allowNull: false
      },
      date_received: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      delivery_note_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tax_invoice_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lpo_no: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Local Purchase Order Number'
      },
      contract_no: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Procurement Reference Number'
      },
      supplier_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      supplier_contact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      delivery_location: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Store Section / Delivery Location'
      },
      status: {
        type: Sequelize.ENUM('draft', 'received', 'inspected', 'approved', 'rejected'),
        defaultValue: 'draft'
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      approved_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      approved_at: {
        type: Sequelize.DATE
      },
      printed_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create GRN Items table
    await queryInterface.createTable('grn_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      grn_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'grns',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      serial_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Auto-increment serial number within the GRN'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      unit_of_measure: {
        type: Sequelize.STRING(30),
        allowNull: true
      },
      qty_ordered: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      qty_delivered: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      qty_accepted: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      unit_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      total_value: {
        type: Sequelize.DECIMAL(14, 2),
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create GRN Attachments table
    await queryInterface.createTable('grn_attachments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      grn_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'grns',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      file_type: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      uploaded_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Create GRN Signatures table
    await queryInterface.createTable('grn_signatures', {
      signature_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      grn_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('receiving_officer', 'inspection_officer', 'head_of_stores', 'accounts_officer', 'head_of_department'),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Physical signature name - filled manually after printing'
      },
      signature: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Physical signature - filled manually after printing'
      },
      signed_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Date when physically signed'
      }
    });

    // Create Ledger table
    await queryInterface.createTable('ledger', {
      ledger_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      reference_type: {
        type: Sequelize.ENUM('grn', 'requisition', 'return', 'adjustment', 'transfer', 'disposal'),
        allowNull: false
      },
      reference_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      item_description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      item_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      unit_of_issue: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity_received: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      quantity_issued: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      balance_on_hand: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      department: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      is_manual_entry: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'True if manually entered by store administrator'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create Ledger Transactions table
    await queryInterface.createTable('ledger_transactions', {
      transaction_log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ledger_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ledger',
          key: 'ledger_id'
        }
      },
      operation_type: {
        type: Sequelize.ENUM('create', 'update', 'delete', 'approve', 'reject'),
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      operation_details: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON string containing details of the operation'
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ledger_transactions');
    await queryInterface.dropTable('ledger');
    await queryInterface.dropTable('grn_signatures');
    await queryInterface.dropTable('grn_attachments');
    await queryInterface.dropTable('grn_items');
    await queryInterface.dropTable('grns');
  }
};
