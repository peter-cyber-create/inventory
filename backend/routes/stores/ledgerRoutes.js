const express = require('express');
const { sequelize } = require('../../config/db');
const router = express.Router();

// Get ledger entries with filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    // Simple query without parameters
    const query = `
      SELECT * FROM ledger 
      ORDER BY "createdAt" DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;

    const entries = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM ledger';
    const countResult = await sequelize.query(countQuery, {
      type: sequelize.QueryTypes.SELECT
    });
    const total = countResult[0].total;

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
router.get('/balance', async (req, res) => {
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
router.get('/low-stock', async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    
    // Get all items first, then filter in JavaScript
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
      ORDER BY SUM(balance_on_hand) ASC
    `;

    const allItems = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    // Filter low stock items in JavaScript
    const lowStockItems = allItems.filter(item => parseInt(item.balance_on_hand) <= threshold);

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
router.post('/', async (req, res) => {
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