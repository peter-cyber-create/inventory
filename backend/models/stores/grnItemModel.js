const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const GRNItem = sequelize.define('grn_items', {
  grn_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  grn_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'grns',
      key: 'grn_id'
    }
  },
  serial_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Auto-increment serial number within the GRN'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    }
  },
  unit_of_measure: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  quantity_ordered: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  quantity_delivered: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  quantity_accepted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  unit_price: {
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
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'grn_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = GRNItem;
