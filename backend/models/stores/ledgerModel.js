const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Ledger = sequelize.define('ledger', {
  ledger_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  reference_type: {
    type: DataTypes.ENUM,
    values: ['grn', 'requisition', 'return', 'adjustment', 'transfer', 'disposal'],
    allowNull: false
  },
  reference_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  item_description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    }
  },
  item_code: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 100]
    }
  },
  unit_of_issue: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  quantity_received: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  quantity_issued: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  balance_on_hand: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  unit_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  total_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 255]
    }
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  is_manual_entry: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'True if manually entered by store administrator'
  }
}, {
  tableName: 'ledger',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Ledger;

