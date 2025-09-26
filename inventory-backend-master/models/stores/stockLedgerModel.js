const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const StockLedger = sequelize.define('stock_ledger', {
  ledger_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'items',
      key: 'item_id'
    }
  },
  transaction_type: {
    type: DataTypes.ENUM,
    values: ['GRN', 'Issuance', 'Return', 'Adjustment', 'Transfer'],
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reference_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 100]
    }
  },
  quantity_in: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  quantity_out: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  unit_cost: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'locations',
      key: 'location_id'
    }
  },
  batch_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 100]
    }
  },
  expiry_date: {
    type: DataTypes.DATE
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'stock_ledger',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = StockLedger;
