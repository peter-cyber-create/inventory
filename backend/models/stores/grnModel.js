const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const GRN = sequelize.define('grns', {
  grn_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  grn_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  date_received: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  delivery_note_no: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 100]
    }
  },
  tax_invoice_no: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 100]
    }
  },
  lpo_no: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Local Purchase Order Number',
    validate: {
      len: [1, 100]
    }
  },
  contract_no: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Procurement Reference Number',
    validate: {
      len: [1, 100]
    }
  },
  supplier_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  supplier_contact: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 255]
    }
  },
  delivery_location: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Store Section / Delivery Location',
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['draft', 'received', 'inspected', 'approved', 'rejected'],
    defaultValue: 'draft'
  },
  total_value: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
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
  approved_at: {
    type: DataTypes.DATE
  },
  printed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'grns',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = GRN;