const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Form5Upload = sequelize.define('form5_uploads', {
  form5_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  form5_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  file_name: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 255]
    }
  },
  file_size: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'form5_uploads',
  timestamps: false
});

module.exports = Form5Upload;
