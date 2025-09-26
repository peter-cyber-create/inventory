const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const RequisitionSignature = sequelize.define('requisition_signatures', {
  signature_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  requisition_id: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
  signed_at: { type: DataTypes.DATE }
}, {
  tableName: 'requisition_signatures',
  timestamps: false
});

module.exports = RequisitionSignature;
