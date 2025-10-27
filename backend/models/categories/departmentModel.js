const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Department = sequelize.define('departments', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 255]
    },
    comment: 'Department name (e.g., IT, Medical Services, Administration)'
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      len: [1, 20]
    },
    comment: 'Department code for quick reference'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  head_of_department_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    },
    comment: 'Official health mail of Head of Department (e.g., hod.pharmacy@health.go.ug)'
  },
  head_of_department_name: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 255]
    }
  },
  contact_person: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 255]
    }
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    },
    comment: 'Department contact email'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 50]
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the department is active'
  },
  requisition_settings: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {},
    comment: 'Department-specific requisition settings (e.g., default signatories)'
  }
}, {
  tableName: 'departments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['name'] },
    { fields: ['code'] },
    { fields: ['is_active'] }
  ]
});

module.exports = Department;
