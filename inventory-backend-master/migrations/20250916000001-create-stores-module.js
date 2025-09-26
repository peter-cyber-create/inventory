'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Master Data Tables
    
    // Suppliers Table
    await queryInterface.createTable('suppliers', {
      supplier_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      supplier_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact_person: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      tin_number: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Locations Table
    await queryInterface.createTable('locations', {
      location_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      location_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location_code: {
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        type: Sequelize.TEXT
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Items Table
    await queryInterface.createTable('items', {
      item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      item_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sub_category: {
        type: Sequelize.STRING
      },
      unit_of_measure: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reorder_level: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      max_level: {
        type: Sequelize.INTEGER
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'suppliers',
          key: 'supplier_id'
        }
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'location_id'
        }
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      description: {
        type: Sequelize.TEXT
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 2. Form5 Uploads Table
    await queryInterface.createTable('form5_uploads', {
      form5_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      form5_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_name: {
        type: Sequelize.STRING
      },
      file_size: {
        type: Sequelize.INTEGER
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      uploaded_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 3. Consignment Data Table
    await queryInterface.createTable('consignment_data', {
      consignment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      consignment_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      form5_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'form5_uploads',
          key: 'form5_id'
        }
      },
      contract_no: {
        type: Sequelize.STRING
      },
      lpo_number: {
        type: Sequelize.STRING
      },
      delivery_note_number: {
        type: Sequelize.STRING
      },
      tax_invoice_number: {
        type: Sequelize.STRING
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'suppliers',
          key: 'supplier_id'
        }
      },
      delivery_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'received', 'partially_received', 'cancelled'],
        defaultValue: 'pending'
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      remarks: {
        type: Sequelize.TEXT
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 4. GRN (Goods Received Notes) Table
    await queryInterface.createTable('grn', {
      grn_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      grn_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      consignment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'consignment_data',
          key: 'consignment_id'
        }
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'item_id'
        }
      },
      quantity_ordered: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      quantity_received: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantity_accepted: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      quantity_rejected: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_cost: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      batch_number: {
        type: Sequelize.STRING
      },
      expiry_date: {
        type: Sequelize.DATE
      },
      manufacture_date: {
        type: Sequelize.DATE
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'location_id'
        }
      },
      received_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      verified_by: {
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
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'verified', 'approved', 'rejected'],
        defaultValue: 'pending'
      },
      remarks: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 5. Stock Ledger Table
    await queryInterface.createTable('stock_ledger', {
      ledger_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'item_id'
        }
      },
      transaction_type: {
        type: Sequelize.ENUM,
        values: ['GRN', 'Issuance', 'Return', 'Adjustment', 'Transfer'],
        allowNull: false
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reference_number: {
        type: Sequelize.STRING
      },
      quantity_in: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      quantity_out: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      balance: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2)
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'location_id'
        }
      },
      batch_number: {
        type: Sequelize.STRING
      },
      expiry_date: {
        type: Sequelize.DATE
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 6. Requisitions Table
    await queryInterface.createTable('requisitions', {
      requisition_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      requisition_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false
      },
      purpose: {
        type: Sequelize.TEXT
      },
      urgency: {
        type: Sequelize.ENUM,
        values: ['normal', 'urgent', 'emergency'],
        defaultValue: 'normal'
      },
      requested_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      supervisor_approved_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      finance_approved_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      auditor_approved_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'supervisor_approved', 'finance_approved', 'auditor_approved', 'approved', 'rejected', 'partially_issued', 'completed'],
        defaultValue: 'pending'
      },
      rejection_reason: {
        type: Sequelize.TEXT
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      approved_at: {
        type: Sequelize.DATE
      },
      required_date: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 7. Requisition Items Table
    await queryInterface.createTable('requisition_items', {
      req_item_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      requisition_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'requisitions',
          key: 'requisition_id'
        }
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'item_id'
        }
      },
      quantity_requested: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantity_approved: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      quantity_issued: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2)
      },
      total_cost: {
        type: Sequelize.DECIMAL(15, 2)
      },
      justification: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'approved', 'partially_issued', 'completed', 'cancelled'],
        defaultValue: 'pending'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 8. Issuances Table
    await queryInterface.createTable('issuances', {
      issuance_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      issuance_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      requisition_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'requisitions',
          key: 'requisition_id'
        }
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'item_id'
        }
      },
      quantity_issued: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2)
      },
      total_cost: {
        type: Sequelize.DECIMAL(15, 2)
      },
      batch_number: {
        type: Sequelize.STRING
      },
      expiry_date: {
        type: Sequelize.DATE
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'location_id'
        }
      },
      issued_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      received_by: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      purpose: {
        type: Sequelize.TEXT
      },
      remarks: {
        type: Sequelize.TEXT
      },
      issued_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 9. Returns Table
    await queryInterface.createTable('returns', {
      return_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      return_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      issuance_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'issuances',
          key: 'issuance_id'
        }
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'item_id'
        }
      },
      quantity_returned: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      return_type: {
        type: Sequelize.ENUM,
        values: ['to_supplier', 'from_department', 'damaged', 'expired', 'excess'],
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      condition: {
        type: Sequelize.ENUM,
        values: ['good', 'damaged', 'expired', 'defective'],
        allowNull: false
      },
      batch_number: {
        type: Sequelize.STRING
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'location_id'
        }
      },
      returned_by: {
        type: Sequelize.STRING
      },
      received_by: {
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
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'approved', 'rejected'],
        defaultValue: 'pending'
      },
      returned_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 10. Adjustments Table
    await queryInterface.createTable('adjustments', {
      adjustment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      adjustment_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'item_id'
        }
      },
      adjustment_type: {
        type: Sequelize.ENUM,
        values: ['Loss', 'Damage', 'Expiry', 'Theft', 'Physical_Count', 'System_Error', 'Transfer'],
        allowNull: false
      },
      quantity_adjusted: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      adjustment_direction: {
        type: Sequelize.ENUM,
        values: ['increase', 'decrease'],
        allowNull: false
      },
      old_quantity: {
        type: Sequelize.INTEGER
      },
      new_quantity: {
        type: Sequelize.INTEGER
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2)
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2)
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      batch_number: {
        type: Sequelize.STRING
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'location_id'
        }
      },
      adjusted_by: {
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
      status: {
        type: Sequelize.ENUM,
        values: ['pending', 'approved', 'rejected'],
        defaultValue: 'pending'
      },
      adjusted_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 11. Audit Log Table
    await queryInterface.createTable('audit_log', {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      old_values: {
        type: Sequelize.JSON
      },
      new_values: {
        type: Sequelize.JSON
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      ip_address: {
        type: Sequelize.STRING
      },
      user_agent: {
        type: Sequelize.TEXT
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // 12. Stock Balance View Helper Table
    await queryInterface.createTable('stock_balances', {
      balance_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'items',
          key: 'item_id'
        }
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'location_id'
        }
      },
      batch_number: {
        type: Sequelize.STRING
      },
      current_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      reserved_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      available_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2)
      },
      total_value: {
        type: Sequelize.DECIMAL(15, 2)
      },
      expiry_date: {
        type: Sequelize.DATE
      },
      last_updated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('items', ['item_code']);
    await queryInterface.addIndex('items', ['category']);
    await queryInterface.addIndex('stock_ledger', ['item_id', 'transaction_date']);
    await queryInterface.addIndex('stock_ledger', ['transaction_type', 'transaction_id']);
    await queryInterface.addIndex('stock_balances', ['item_id', 'location_id']);
    await queryInterface.addIndex('grn', ['consignment_id']);
    await queryInterface.addIndex('requisitions', ['status', 'created_at']);
    await queryInterface.addIndex('issuances', ['requisition_id']);
    await queryInterface.addIndex('audit_log', ['entity', 'entity_id']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to handle foreign key constraints
    await queryInterface.dropTable('audit_log');
    await queryInterface.dropTable('stock_balances');
    await queryInterface.dropTable('adjustments');
    await queryInterface.dropTable('returns');
    await queryInterface.dropTable('issuances');
    await queryInterface.dropTable('requisition_items');
    await queryInterface.dropTable('requisitions');
    await queryInterface.dropTable('stock_ledger');
    await queryInterface.dropTable('grn');
    await queryInterface.dropTable('consignment_data');
    await queryInterface.dropTable('form5_uploads');
    await queryInterface.dropTable('items');
    await queryInterface.dropTable('locations');
    await queryInterface.dropTable('suppliers');
  }
};
