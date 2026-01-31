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
      SELECT * FROM ledger 
      ORDER BY "createdAt" DESC
      LIMIT :limit OFFSET :offset
    `;

    const entries = await sequelize.query(query, {
      replacements: { limit: safeLimit, offset: safeOffset },
      type: sequelize.QueryTypes.SELECT
    });

    // Get total count - safe static query
    const countQuery = 'SELECT COUNT(*) as total FROM ledger';
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
        item_code,
        MAX(item_description) as item_description,
        MAX(unit_of_issue) as unit_of_issue,
        SUM(balance_on_hand) as balance_on_hand,
        AVG(unit_cost) as unit_cost,
        SUM(total_value) as total_value,
        MAX(department) as department
      FROM ledger 
      GROUP BY item_code
      ORDER BY item_code ASC
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
        item_code,
        MAX(item_description) as item_description,
        MAX(unit_of_issue) as unit_of_issue,
        SUM(balance_on_hand) as balance_on_hand,
        AVG(unit_cost) as unit_cost,
        MAX(department) as department
      FROM ledger 
      GROUP BY item_code
      HAVING SUM(balance_on_hand) <= :threshold
      ORDER BY SUM(balance_on_hand) ASC
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
      transaction_date,
      reference_type,
      reference_number,
      item_description,
      item_code,
      unit_of_issue,
      quantity_received,
      quantity_issued,
      balance_on_hand,
      unit_cost,
      total_value,
      department,
      remarks,
      created_by,
      is_manual_entry
    } = req.body;

    const query = `
      INSERT INTO ledger (
        transaction_date, reference_type, reference_number, item_description,
        item_code, unit_of_issue, quantity_received, quantity_issued,
        balance_on_hand, unit_cost, total_value, department, remarks,
        created_by, is_manual_entry
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      replacements: [
        transaction_date || new Date().toISOString().split('T')[0],
        reference_type,
        reference_number,
        item_description,
        item_code,
        unit_of_issue,
        quantity_received || 0,
        quantity_issued || 0,
        balance_on_hand || 0,
        unit_cost || 0,
        total_value || 0,
        department,
        remarks,
        created_by || 'system',
        is_manual_entry || false
      ],
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