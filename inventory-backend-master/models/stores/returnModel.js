const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Return = sequelize.define('returns', {
  return_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  return_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  issuance_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'issuances',
      key: 'issuance_id'
    }
  },
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'items',
      key: 'item_id'
    }
  },
  quantity_returned: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  return_type: {
    type: DataTypes.ENUM,
    values: ['to_supplier', 'from_department', 'damaged', 'expired', 'excess'],
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  condition: {
    type: DataTypes.ENUM,
    values: ['good', 'damaged', 'expired', 'defective'],
    allowNull: false
  },
  batch_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 100]
    }
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'locations',
      key: 'location_id'
    }
  },
  returned_by: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 255]
    }
  },
  received_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'approved', 'rejected'],
    defaultValue: 'pending'
  },
  returned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'returns',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Return;
