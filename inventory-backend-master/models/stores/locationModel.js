const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Location = sequelize.define('locations', {
  location_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  location_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  location_code: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [1, 20]
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  capacity: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
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
  tableName: 'locations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Location;
