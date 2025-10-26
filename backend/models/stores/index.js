const Supplier = require('./supplierModel.js');
const Location = require('./locationModel.js');
const Item = require('./itemModel.js');
const Form5Upload = require('./form5UploadModel.js');
const ConsignmentData = require('./consignmentDataModel.js');
const GRN = require('./grnModel.js');
const StockLedger = require('./stockLedgerModel.js');
const Requisition = require('./requisitionModel.js');
const RequisitionItem = require('./requisitionItemModel.js');
const Issuance = require('./issuanceModel.js');
const Return = require('./returnModel.js');
const Adjustment = require('./adjustmentModel.js');
const AuditLog = require('./auditLogModel.js');
const StockBalance = require('./stockBalanceModel.js');
const User = require('../users/userModel.js');

// Define relationships

// Item relationships
Item.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
Item.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
Item.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Supplier.hasMany(Item, { foreignKey: 'supplier_id', as: 'items' });
Location.hasMany(Item, { foreignKey: 'location_id', as: 'items' });

// Form5 and Consignment relationships
Form5Upload.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
Form5Upload.hasOne(ConsignmentData, { foreignKey: 'form5_id', as: 'consignment' });

ConsignmentData.belongsTo(Form5Upload, { foreignKey: 'form5_id', as: 'form5' });
ConsignmentData.belongsTo(Supplier, { foreignKey: 'supplier_id', as: 'supplier' });
ConsignmentData.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
ConsignmentData.hasMany(GRN, { foreignKey: 'consignment_id', as: 'grns' });

// GRN relationships
GRN.belongsTo(ConsignmentData, { foreignKey: 'consignment_id', as: 'consignment' });
GRN.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
GRN.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
GRN.belongsTo(User, { foreignKey: 'received_by', as: 'receiver' });
GRN.belongsTo(User, { foreignKey: 'verified_by', as: 'verifier' });
GRN.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

Item.hasMany(GRN, { foreignKey: 'item_id', as: 'grns' });
Location.hasMany(GRN, { foreignKey: 'location_id', as: 'grns' });

// Stock Ledger relationships
StockLedger.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
StockLedger.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
StockLedger.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Item.hasMany(StockLedger, { foreignKey: 'item_id', as: 'ledgerEntries' });
Location.hasMany(StockLedger, { foreignKey: 'location_id', as: 'ledgerEntries' });

// Requisition relationships
Requisition.belongsTo(User, { foreignKey: 'requested_by', as: 'requester' });
Requisition.belongsTo(User, { foreignKey: 'supervisor_approved_by', as: 'supervisorApprover' });
Requisition.belongsTo(User, { foreignKey: 'finance_approved_by', as: 'financeApprover' });
Requisition.belongsTo(User, { foreignKey: 'auditor_approved_by', as: 'auditorApprover' });
Requisition.hasMany(RequisitionItem, { foreignKey: 'requisition_id', as: 'items' });
Requisition.hasMany(Issuance, { foreignKey: 'requisition_id', as: 'issuances' });

// Requisition Item relationships
RequisitionItem.belongsTo(Requisition, { foreignKey: 'requisition_id', as: 'requisition' });
RequisitionItem.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

Item.hasMany(RequisitionItem, { foreignKey: 'item_id', as: 'requisitionItems' });

// Issuance relationships
Issuance.belongsTo(Requisition, { foreignKey: 'requisition_id', as: 'requisition' });
Issuance.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
Issuance.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
Issuance.belongsTo(User, { foreignKey: 'issued_by', as: 'issuer' });
Issuance.hasMany(Return, { foreignKey: 'issuance_id', as: 'returns' });

Item.hasMany(Issuance, { foreignKey: 'item_id', as: 'issuances' });
Location.hasMany(Issuance, { foreignKey: 'location_id', as: 'issuances' });

// Return relationships
Return.belongsTo(Issuance, { foreignKey: 'issuance_id', as: 'issuance' });
Return.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
Return.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
Return.belongsTo(User, { foreignKey: 'received_by', as: 'receiver' });
Return.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

Item.hasMany(Return, { foreignKey: 'item_id', as: 'returns' });
Location.hasMany(Return, { foreignKey: 'location_id', as: 'returns' });

// Adjustment relationships
Adjustment.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
Adjustment.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
Adjustment.belongsTo(User, { foreignKey: 'adjusted_by', as: 'adjuster' });
Adjustment.belongsTo(User, { foreignKey: 'approved_by', as: 'approver' });

Item.hasMany(Adjustment, { foreignKey: 'item_id', as: 'adjustments' });
Location.hasMany(Adjustment, { foreignKey: 'location_id', as: 'adjustments' });

// Stock Balance relationships
StockBalance.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });
StockBalance.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });

Item.hasMany(StockBalance, { foreignKey: 'item_id', as: 'stockBalances' });
Location.hasMany(StockBalance, { foreignKey: 'location_id', as: 'stockBalances' });

// Audit Log relationships
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });

// Location and Supplier relationships with User
Location.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Supplier.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Location, { foreignKey: 'created_by', as: 'createdLocations' });
User.hasMany(Supplier, { foreignKey: 'created_by', as: 'createdSuppliers' });


module.exports = {
  Supplier,
  Location,
  Item,
  Form5Upload,
  ConsignmentData,
  GRN,
  StockLedger,
  Requisition,
  RequisitionItem,
  Issuance,
  Return,
  Adjustment,
  AuditLog,
  StockBalance,
  User
};
