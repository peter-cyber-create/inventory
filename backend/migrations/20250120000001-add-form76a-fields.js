'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add Form 76A specific fields to requisitions table
    await queryInterface.addColumn('requisitions', 'serial_no', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
      after: 'requisition_id'
    });

    await queryInterface.addColumn('requisitions', 'form_date', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
      after: 'requisition_number'
    });

    await queryInterface.addColumn('requisitions', 'from_department', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'form_date'
    });

    await queryInterface.addColumn('requisitions', 'to_store', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'from_department'
    });

    await queryInterface.addColumn('requisitions', 'purpose_remarks', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'to_store'
    });

    await queryInterface.addColumn('requisitions', 'printed_at', {
      type: Sequelize.DATE,
      allowNull: true,
      after: 'required_date'
    });

    // Update status enum to include Form 76A workflow states
    await queryInterface.changeColumn('requisitions', 'status', {
      type: Sequelize.ENUM,
      values: ['draft', 'submitted', 'printed', 'pending', 'supervisor_approved', 'finance_approved', 'auditor_approved', 'approved', 'rejected', 'partially_issued', 'completed'],
      defaultValue: 'draft'
    });

    // Add Form 76A specific fields to requisition_items table
    await queryInterface.addColumn('requisition_items', 'serial_no', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Auto-increment serial number within the form',
      after: 'requisition_id'
    });

    await queryInterface.addColumn('requisition_items', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'serial_no'
    });

    await queryInterface.addColumn('requisition_items', 'unit_of_issue', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'description'
    });

    await queryInterface.addColumn('requisition_items', 'quantity_ordered', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'unit_of_issue'
    });

    await queryInterface.addColumn('requisition_items', 'quantity_received', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      after: 'quantity_issued'
    });

    // Update requisition_signatures table for Form 76A
    await queryInterface.changeColumn('requisition_signatures', 'role', {
      type: Sequelize.ENUM,
      values: ['requisition_officer', 'approving_officer', 'issuing_officer', 'receiving_officer', 'head_of_department'],
      allowNull: false
    });

    await queryInterface.addColumn('requisition_signatures', 'signature', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Physical signature - filled manually after printing',
      after: 'name'
    });
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

