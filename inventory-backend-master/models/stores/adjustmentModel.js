const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Adjustment = sequelize.define('adjustments', {
  adjustment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  adjustment_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'items',
      key: 'item_id'
    }
  },
  adjustment_type: {
    type: DataTypes.ENUM,
    values: ['Loss', 'Damage', 'Expiry', 'Theft', 'Physical_Count', 'System_Error', 'Transfer'],
    allowNull: false
  },
  quantity_adjusted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  adjustment_direction: {
    type: DataTypes.ENUM,
    values: ['increase', 'decrease'],
    allowNull: false
  },
  old_quantity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  new_quantity: {
    type: DataTypes.INTEGER,
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
  total_value: {
    type: DataTypes.DECIMAL(15, 2),
    validate: {
      min: 0
    }
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
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
  adjusted_by: {
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
  adjusted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'adjustments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Adjustment;
