const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Supplier = sequelize.define('suppliers', {
  supplier_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  supplier_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  contact_person: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 255]
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 20]
    }
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.TEXT
  },
  tin_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 50]
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'suppliers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Supplier;
