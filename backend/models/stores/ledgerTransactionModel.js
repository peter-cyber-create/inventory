const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const LedgerTransaction = sequelize.define('ledger_transactions', {
  transaction_log_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  ledger_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'ledger',
      key: 'ledger_id'
    }
  },
  operation_type: {
    type: DataTypes.ENUM,
    values: ['create', 'update', 'delete', 'approve', 'reject'],
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  operation_details: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON string containing details of the operation'
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'ledger_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = LedgerTransaction;
