const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const AuditLog = sequelize.define('audit_log', {
  log_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  entity: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  old_values: {
    type: DataTypes.JSON
  },
  new_values: {
    type: DataTypes.JSON
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  ip_address: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 50]
    }
  },
  user_agent: {
    type: DataTypes.TEXT
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'audit_log',
  timestamps: false
});

module.exports = AuditLog;
