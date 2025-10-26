const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const ConsignmentData = sequelize.define('consignment_data', {
  consignment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  consignment_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  form5_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'form5_uploads',
      key: 'form5_id'
    }
  },
  contract_no: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 100]
    }
  },
  lpo_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 100]
    }
  },
  delivery_note_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 100]
    }
  },
  tax_invoice_number: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 100]
    }
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'suppliers',
      key: 'supplier_id'
    }
  },
  delivery_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'received', 'partially_received', 'cancelled'],
    defaultValue: 'pending'
  },
  total_value: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  remarks: {
    type: DataTypes.TEXT
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'consignment_data',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ConsignmentData;
