const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const RequisitionItem = sequelize.define('requisition_items', {
  req_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  requisition_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'requisitions',
      key: 'requisition_id'
    }
  },
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'items',
      key: 'item_id'
    }
  },
  quantity_requested: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  quantity_approved: {
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
  unit_cost: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  total_cost: {
    type: DataTypes.DECIMAL(15, 2),
    validate: {
      min: 0
    }
  },
  justification: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'approved', 'partially_issued', 'completed', 'cancelled'],
    defaultValue: 'pending'
  }
}, {
  tableName: 'requisition_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = RequisitionItem;
