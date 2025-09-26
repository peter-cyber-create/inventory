const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Issuance = sequelize.define('issuances', {
  issuance_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  issuance_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
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
  quantity_issued: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
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
  batch_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 100]
    }
  },
  expiry_date: {
    type: DataTypes.DATE
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'locations',
      key: 'location_id'
    }
  },
  issued_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  received_by: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 255]
    }
  },
  department: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 255]
    }
  },
  purpose: {
    type: DataTypes.TEXT
  },
  remarks: {
    type: DataTypes.TEXT
  },
  issued_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'issuances',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Issuance;
