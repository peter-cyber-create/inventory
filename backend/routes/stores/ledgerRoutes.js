const express = require('express');
const router = express.Router();
const { StockLedger, Item, Location, StockBalance } = require('../../models/stores');
const { Op } = require('sequelize');

// Get stock ledger entries
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const { item_id, location_id, transaction_type, start_date, end_date } = req.query;

    const whereClause = {};
    
    if (item_id) whereClause.item_id = item_id;
    if (location_id) whereClause.location_id = location_id;
    if (transaction_type) whereClause.transaction_type = transaction_type;
    
    if (start_date && end_date) {
      whereClause.transaction_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const { count, rows: ledgerEntries } = await StockLedger.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['item_id', 'item_name', 'item_code', 'unit_of_measure']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name']
        }
      ],
      limit,
      offset,
      order: [['transaction_date', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        ledgerEntries,
        pagination: {
          current: page,
          pageSize: limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching stock ledger:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock ledger',
      error: error.message
    });
  }
});

// Get ledger for specific item
router.get('/item/:item_id', async (req, res) => {
  try {
    const { item_id } = req.params;
    const { location_id, limit = 100 } = req.query;

    const whereClause = { item_id };
    if (location_id) whereClause.location_id = location_id;

    const ledgerEntries = await StockLedger.findAll({
      where: whereClause,
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['item_id', 'item_name', 'item_code']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name']
        }
      ],
      limit: parseInt(limit),
      order: [['transaction_date', 'DESC']]
    });

    res.json({
      success: true,
      data: ledgerEntries
    });
  } catch (error) {
    console.error('Error fetching item ledger:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item ledger',
      error: error.message
    });
  }
});

// Get current stock balance
router.get('/balance', async (req, res) => {
  try {
    const { item_id, location_id } = req.query;

    const whereClause = {};
    if (item_id) whereClause.item_id = item_id;
    if (location_id) whereClause.location_id = location_id;

    const stockBalances = await StockBalance.findAll({
      where: whereClause,
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['item_id', 'item_name', 'item_code', 'unit_of_measure']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name']
        }
      ],
      order: [['item_id', 'ASC']]
    });

    res.json({
      success: true,
      data: stockBalances
    });
  } catch (error) {
    console.error('Error fetching stock balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock balance',
      error: error.message
    });
  }
});

// Get stock movement summary
router.get('/movement/summary', async (req, res) => {
  try {
    const { start_date, end_date, item_id, location_id } = req.query;

    const whereClause = {};
    if (item_id) whereClause.item_id = item_id;
    if (location_id) whereClause.location_id = location_id;
    if (start_date && end_date) {
      whereClause.transaction_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const movements = await StockLedger.findAll({
      where: whereClause,
      attributes: [
        'transaction_type',
        [StockLedger.sequelize.fn('SUM', StockLedger.sequelize.col('quantity')), 'total_quantity'],
        [StockLedger.sequelize.fn('SUM', StockLedger.sequelize.col('total_cost')), 'total_value']
      ],
      group: ['transaction_type'],
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['item_name'],
          required: false
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_name'],
          required: false
        }
      ]
    });

    res.json({
      success: true,
      data: movements
    });
  } catch (error) {
    console.error('Error fetching movement summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch movement summary',
      error: error.message
    });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const { threshold = 10 } = req.query;

    const lowStockItems = await StockBalance.findAll({
      where: {
        quantity_available: {
          [Op.lt]: parseInt(threshold)
        }
      },
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['item_id', 'item_name', 'item_code', 'unit_of_measure', 'minimum_stock_level']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name']
        }
      ],
      order: [['quantity_available', 'ASC']]
    });

    res.json({
      success: true,
      data: lowStockItems
    });
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock items',
      error: error.message
    });
  }
});

module.exports = router;
