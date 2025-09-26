const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Requisition = sequelize.define('requisitions', {
  requisition_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  requisition_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  purpose: {
    type: DataTypes.TEXT
  },
  urgency: {
    type: DataTypes.ENUM,
    values: ['normal', 'urgent', 'emergency'],
    defaultValue: 'normal'
  },
  requested_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  supervisor_approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  finance_approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  auditor_approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'supervisor_approved', 'finance_approved', 'auditor_approved', 'approved', 'rejected', 'partially_issued', 'completed'],
    defaultValue: 'pending'
  },
  rejection_reason: {
    type: DataTypes.TEXT
  },
  total_value: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  approved_at: {
    type: DataTypes.DATE
  },
  required_date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'requisitions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Requisition;
