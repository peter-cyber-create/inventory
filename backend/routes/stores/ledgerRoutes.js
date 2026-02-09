const express = require('express');
const { sequelize } = require('../../config/db');
const Auth = require('../../middleware/auth.js');
const authorize = require('../../middleware/authorize.js');
const router = express.Router();

// Get ledger entries with filters
router.get('/', Auth, authorize('admin', 'store'), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    // Validate and sanitize inputs
    const safeLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100); // Between 1 and 100
    const safeOffset = Math.max(parseInt(offset) || 0, 0); // Non-negative

    // Parameterized query to prevent SQL injection
    const query = `
      SELECT 
        sl.ledger_id,
        sl.item_id,
        sl.transaction_type,
        sl.transaction_id,
        sl.reference_number,
        sl.quantity_in,
        sl.quantity_out,
        sl.balance,
        sl.unit_cost,
        sl.location_id,
        sl.batch_number,
        sl.expiry_date,
        sl.transaction_date,
        sl.created_by,
        sl.created_at,
        i.item_code,
        i.item_description,
        i.unit_of_issue,
        l.location_name
      FROM stock_ledger sl
      LEFT JOIN items i ON sl.item_id = i.item_id
      LEFT JOIN locations l ON sl.location_id = l.location_id
      ORDER BY sl.created_at DESC
      LIMIT :limit OFFSET :offset
    `;

    const entries = await sequelize.query(query, {
      replacements: { limit: safeLimit, offset: safeOffset },
      type: sequelize.QueryTypes.SELECT
    });

    // Get total count - safe static query
    const countQuery = 'SELECT COUNT(*) as total FROM stock_ledger';
    const countResult = await sequelize.query(countQuery, {
      type: sequelize.QueryTypes.SELECT
    });
    const total = countResult[0]?.total || 0;

    res.status(200).json({
      status: 'success',
      data: entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching ledger entries:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching ledger entries',
      error: error.message
    });
  }
});

// Get stock balances
router.get('/balance', Auth, authorize('admin', 'store'), async (req, res) => {
  try {
    const query = `
      SELECT 
        i.item_code,
        i.item_description,
        i.unit_of_issue,
        SUM(sl.balance) as balance_on_hand,
        AVG(sl.unit_cost) as unit_cost,
        SUM(sl.balance * sl.unit_cost) as total_value,
        l.location_name as department
      FROM stock_ledger sl
      LEFT JOIN items i ON sl.item_id = i.item_id
      LEFT JOIN locations l ON sl.location_id = l.location_id
      GROUP BY i.item_code, i.item_description, i.unit_of_issue, l.location_name
      ORDER BY i.item_code ASC
    `;

    const balances = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    res.status(200).json({
      status: 'success',
      data: balances
    });
  } catch (error) {
    console.error('Error fetching stock balances:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching stock balances',
      error: error.message
    });
  }
});

// Get low stock items
router.get('/low-stock', Auth, authorize('admin', 'store'), async (req, res) => {
  try {
    // Validate and sanitize threshold input
    const threshold = Math.max(parseInt(req.query.threshold) || 10, 0);
    
    // Parameterized query to prevent SQL injection
    const query = `
      SELECT 
        i.item_code,
        i.item_description,
        i.unit_of_issue,
        SUM(sl.balance) as balance_on_hand,
        AVG(sl.unit_cost) as unit_cost,
        l.location_name as department
      FROM stock_ledger sl
      LEFT JOIN items i ON sl.item_id = i.item_id
      LEFT JOIN locations l ON sl.location_id = l.location_id
      GROUP BY i.item_code, i.item_description, i.unit_of_issue, l.location_name
      HAVING SUM(sl.balance) <= :threshold
      ORDER BY SUM(sl.balance) ASC
    `;

    const lowStockItems = await sequelize.query(query, {
      replacements: { threshold: threshold },
      type: sequelize.QueryTypes.SELECT
    });

    res.status(200).json({
      status: 'success',
      data: lowStockItems,
      threshold: threshold
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching low stock items',
      error: error.message
    });
  }
});

// Add new ledger entry
router.post('/', Auth, authorize('admin', 'store'), async (req, res) => {
  try {
    const {
      item_id,
      location_id,
      transaction_type,
      quantity_in,
      quantity_out,
      unit_cost,
      batch_number,
      expiry_date,
      reference_number,
      created_by
    } = req.body;

    const balance = (quantity_in || 0) - (quantity_out || 0);

    const query = `
      INSERT INTO stock_ledger (
        item_id, location_id, transaction_type, transaction_id,
        quantity_in, quantity_out, balance, unit_cost, 
        batch_number, expiry_date, reference_number, transaction_date,
        created_by
      ) VALUES (:item_id, :location_id, :transaction_type, 0,
        :quantity_in, :quantity_out, :balance, :unit_cost, 
        :batch_number, :expiry_date, :reference_number, NOW(),
        :created_by)
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      replacements: {
        item_id,
        location_id,
        transaction_type: transaction_type || 'Manual',
        quantity_in: quantity_in || 0,
        quantity_out: quantity_out || 0,
        balance: balance,
        unit_cost: unit_cost || 0,
        batch_number: batch_number || null,
        expiry_date: expiry_date || null,
        reference_number: reference_number || 'MANUAL',
        created_by: created_by || 'system'
      },
      type: sequelize.QueryTypes.INSERT
    });

    res.status(201).json({
      status: 'success',
      message: 'Ledger entry created successfully',
      data: result[0]
    });
  } catch (error) {
    console.error('Error creating ledger entry:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating ledger entry',
      error: error.message
    });
  }
});

module.exports = router;