const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const GRNAttachment = sequelize.define('grn_attachments', {
  attachment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  grn_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'grns',
      key: 'grn_id'
    }
  },
  document_type: {
    type: DataTypes.ENUM,
    values: ['form5', 'technical_specs', 'delivery_note', 'invoice', 'other'],
    allowNull: false
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    }
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 100]
    }
  },
  uploaded_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'grn_attachments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = GRNAttachment;
