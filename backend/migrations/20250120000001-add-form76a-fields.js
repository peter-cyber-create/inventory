'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if requisitions table exists before adding columns
    const tableExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'requisitions');",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (!tableExists[0].exists) {
      console.log('⚠️  requisitions table does not exist yet. Skipping this migration.');
      return;
    }

    // Add Form 76A specific fields to requisitions table
    // Check if column exists before adding
    const columns = await queryInterface.sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'requisitions' AND column_name = 'serial_no';",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (columns.length === 0) {
      await queryInterface.addColumn('requisitions', 'serial_no', {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      });
    }

    // Add other columns if they don't exist
    const checkAndAddColumn = async (table, column, definition) => {
      const exists = await queryInterface.sequelize.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${table}' AND column_name = '${column}';`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      if (exists.length === 0) {
        await queryInterface.addColumn(table, column, definition);
      }
    };

    await checkAndAddColumn('requisitions', 'form_date', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    });

    await checkAndAddColumn('requisitions', 'from_department', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await checkAndAddColumn('requisitions', 'to_store', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await checkAndAddColumn('requisitions', 'purpose_remarks', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await checkAndAddColumn('requisitions', 'printed_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Update status enum to include Form 76A workflow states
    // PostgreSQL requires dropping and recreating the enum type
    try {
      await queryInterface.sequelize.query(`
        DO $$ 
        BEGIN
          IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_requisitions_status') THEN
            ALTER TYPE enum_requisitions_status ADD VALUE IF NOT EXISTS 'draft';
            ALTER TYPE enum_requisitions_status ADD VALUE IF NOT EXISTS 'submitted';
            ALTER TYPE enum_requisitions_status ADD VALUE IF NOT EXISTS 'printed';
          END IF;
        END $$;
      `);
    } catch (error) {
      console.log('⚠️  Could not update enum, may already have values:', error.message);
    }

    // Add Form 76A specific fields to requisition_items table (if table exists)
    const itemsExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'requisition_items');",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (itemsExists[0].exists) {
      await checkAndAddColumn('requisition_items', 'serial_no', {
        type: Sequelize.INTEGER,
        allowNull: true
      });

      await checkAndAddColumn('requisition_items', 'description', {
        type: Sequelize.STRING,
        allowNull: true
      });

      await checkAndAddColumn('requisition_items', 'unit_of_issue', {
        type: Sequelize.STRING,
        allowNull: true
      });

      await checkAndAddColumn('requisition_items', 'quantity_ordered', {
        type: Sequelize.INTEGER,
        allowNull: true
      });

      await checkAndAddColumn('requisition_items', 'quantity_received', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      });
    }

    // Update requisition_signatures table for Form 76A (if it exists)
    const signaturesExists = await queryInterface.sequelize.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'requisition_signatures');",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (signaturesExists[0].exists) {
      try {
        await queryInterface.changeColumn('requisition_signatures', 'role', {
          type: Sequelize.ENUM,
          values: ['requisition_officer', 'approving_officer', 'issuing_officer', 'receiving_officer', 'head_of_department'],
          allowNull: false
        });
      } catch (error) {
        console.log('⚠️  Could not update requisition_signatures.role:', error.message);
      }

      await checkAndAddColumn('requisition_signatures', 'signature', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove Form 76A specific fields from requisitions table
    await queryInterface.removeColumn('requisitions', 'serial_no');
    await queryInterface.removeColumn('requisitions', 'form_date');
    await queryInterface.removeColumn('requisitions', 'from_department');
    await queryInterface.removeColumn('requisitions', 'to_store');
    await queryInterface.removeColumn('requisitions', 'purpose_remarks');
    await queryInterface.removeColumn('requisitions', 'printed_at');

    // Revert status enum to original values
    await queryInterface.changeColumn('requisitions', 'status', {
      type: Sequelize.ENUM,
      values: ['pending', 'supervisor_approved', 'finance_approved', 'auditor_approved', 'approved', 'rejected', 'partially_issued', 'completed'],
      defaultValue: 'pending'
    });

    // Remove Form 76A specific fields from requisition_items table
    await queryInterface.removeColumn('requisition_items', 'serial_no');
    await queryInterface.removeColumn('requisition_items', 'description');
    await queryInterface.removeColumn('requisition_items', 'unit_of_issue');
    await queryInterface.removeColumn('requisition_items', 'quantity_ordered');
    await queryInterface.removeColumn('requisition_items', 'quantity_received');

    // Revert requisition_signatures table
    await queryInterface.changeColumn('requisition_signatures', 'role', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.removeColumn('requisition_signatures', 'signature');
  }
};

