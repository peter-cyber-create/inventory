'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create requisitions table (Form 76A)
    await queryInterface.createTable('requisitions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      serial_no: {
        type: Sequelize.STRING(30),
        unique: true,
        allowNull: false
      },
      requisition_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      destination: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      purpose: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'Draft'
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
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create requisition_items table
    await queryInterface.createTable('requisition_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      requisition_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'requisitions',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      serial_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Auto-increment serial number within the form'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      qty_ordered: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      qty_approved: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      qty_issued: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      qty_received: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create requisition_signatures table
    await queryInterface.createTable('requisition_signatures', {
      signature_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      requisition_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('requisition_officer', 'approving_officer', 'issuing_officer', 'receiving_officer', 'head_of_department'),
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('requisition_signatures');
    await queryInterface.dropTable('requisition_items');
    await queryInterface.dropTable('requisitions');
  }
};

