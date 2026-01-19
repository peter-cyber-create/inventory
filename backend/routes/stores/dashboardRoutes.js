
const express = require('express');
const auth = require('../../middleware/auth.js');
const {
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
} = require('../../models/stores/index.js');

const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/db');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/form5/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'form5-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and Office documents are allowed'));
    }
  }
});

// Audit logging middleware
const auditLog = async (action, entity, entityId, oldValues, newValues, req) => {
  try {
    await AuditLog.create({
      action,
      entity,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      user_id: req.user.id,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
};

// Generate unique numbers
const generateNumber = async (prefix, model, field) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const baseNumber = `${prefix}${year}${month}${day}`;
  
  const lastRecord = await model.findOne({
    where: {
      [field]: {
        [Op.like]: `${baseNumber}%`
      }
    },
    order: [[field, 'DESC']]
  });
  
  let sequence = 1;
  if (lastRecord) {
    const lastNumber = lastRecord[field];
    const lastSequence = parseInt(lastNumber.slice(-3));
    sequence = lastSequence + 1;
  }
  
  return `${baseNumber}${String(sequence).padStart(3, '0')}`;
};

// Update stock balance helper function
const updateStockBalance = async (itemId, locationId, batchNumber, quantityChange, unitCost, expiryDate) => {
  const existingBalance = await StockBalance.findOne({
    where: {
      item_id: itemId,
      location_id: locationId,
      batch_number: batchNumber || null
    }
  });

  if (existingBalance) {
    const newQuantity = existingBalance.current_quantity + quantityChange;
    const newAvailable = Math.max(0, newQuantity - existingBalance.reserved_quantity);
    
    await existingBalance.update({
      current_quantity: newQuantity,
      available_quantity: newAvailable,
      unit_cost: unitCost || existingBalance.unit_cost,
      total_value: newQuantity * (unitCost || existingBalance.unit_cost),
      last_updated: new Date()
    });
  } else if (quantityChange > 0) {
    await StockBalance.create({
      item_id: itemId,
      location_id: locationId,
      batch_number: batchNumber,
      current_quantity: quantityChange,
      available_quantity: quantityChange,
      unit_cost: unitCost,
      total_value: quantityChange * unitCost,
      expiry_date: expiryDate,
      last_updated: new Date()
    });
  }
};

// Dashboard endpoint - Overview statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [
      totalItems,
      lowStockItems,
      pendingGRNs,
      pendingRequisitions,
      totalValue,
      expiringItems
    ] = await Promise.all([
      // Total active items
      Item.count({ where: { is_active: true } }),
      
      // Low stock items (below reorder level) - Safe static query
      sequelize.query(`
        SELECT COUNT(DISTINCT i.item_id) as count
        FROM items i
        LEFT JOIN stock_balances sb ON i.item_id = sb.item_id
        WHERE i.is_active = true 
        AND (sb.current_quantity <= i.reorder_level OR sb.current_quantity IS NULL)
      `, { type: sequelize.QueryTypes.SELECT }),
      
      // Pending GRNs
      GRN.count({ where: { status: 'pending' } }),
      
      // Pending requisitions
      Requisition.count({ where: { status: ['pending', 'supervisor_approved', 'finance_approved'] } }),
      
      // Total inventory value - Safe static query
      sequelize.query(`
        SELECT SUM(total_value) as total_value
        FROM stock_balances
        WHERE current_quantity > 0
      `, { type: sequelize.QueryTypes.SELECT }),
      
      // Items expiring in next 30 days
      StockBalance.count({
        where: {
          expiry_date: {
            [Op.between]: [new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
          },
          current_quantity: {
            [Op.gt]: 0
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalItems,
        lowStockItems: (lowStockItems && lowStockItems[0] && lowStockItems[0].count) || 0,
        pendingGRNs,
        pendingRequisitions,
        totalValue: (totalValue && totalValue[0] && totalValue[0].total_value) || 0,
        expiringItems
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
