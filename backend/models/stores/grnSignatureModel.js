const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const GRNSignature = sequelize.define('grn_signatures', {
  signature_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  grn_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    values: ['receiving_officer', 'inspection_officer', 'head_of_stores', 'accounts_officer', 'head_of_department'],
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Physical signature name - filled manually after printing'
  },
  signature: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Physical signature - filled manually after printing'
  },
  signed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date when physically signed'
  }
}, {
  tableName: 'grn_signatures',
  timestamps: false
});

module.exports = GRNSignature;

