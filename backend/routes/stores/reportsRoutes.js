const express = require('express');
const router = express.Router();
const { 
  StockLedger, 
  StockBalance, 
  Item, 
  Location, 
  GRN, 
  Issuance, 
  Requisition,
  Supplier 
} = require('../../models/stores');
const { Op } = require('sequelize');

// Stock Movement Report
router.get('/stock-movement', async (req, res) => {
  try {
    const { start_date, end_date, item_id, location_id, transaction_type } = req.query;

    const whereClause = {};
    if (item_id) whereClause.item_id = item_id;
    if (location_id) whereClause.location_id = location_id;
    if (transaction_type) whereClause.transaction_type = transaction_type;
    if (start_date && end_date) {
      whereClause.transaction_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const movements = await StockLedger.findAll({
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
      order: [['transaction_date', 'DESC']]
    });

    res.json({
      success: true,
      data: movements
    });
  } catch (error) {
    console.error('Error generating stock movement report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate stock movement report',
      error: error.message
    });
  }
});

// Stock Balance Report
router.get('/stock-balance', async (req, res) => {
  try {
    const { location_id, low_stock_threshold } = req.query;

    const whereClause = {};
    if (location_id) whereClause.location_id = location_id;
    if (low_stock_threshold) {
      whereClause.quantity_available = {
        [Op.lt]: parseInt(low_stock_threshold)
      };
    }

    const balances = await StockBalance.findAll({
      where: whereClause,
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
      data: balances
    });
  } catch (error) {
    console.error('Error generating stock balance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate stock balance report',
      error: error.message
    });
  }
});

// Consumption Report
router.get('/consumption', async (req, res) => {
  try {
    const { start_date, end_date, item_id, location_id } = req.query;

    const whereClause = {
      transaction_type: 'issue'
    };
    
    if (item_id) whereClause.item_id = item_id;
    if (location_id) whereClause.location_id = location_id;
    if (start_date && end_date) {
      whereClause.transaction_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const consumption = await StockLedger.findAll({
      where: whereClause,
      attributes: [
        'item_id',
        'location_id',
        [StockLedger.sequelize.fn('SUM', StockLedger.sequelize.col('quantity')), 'total_consumed'],
        [StockLedger.sequelize.fn('SUM', StockLedger.sequelize.col('total_cost')), 'total_value']
      ],
      group: ['item_id', 'location_id'],
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
      order: [[StockLedger.sequelize.fn('SUM', StockLedger.sequelize.col('quantity')), 'DESC']]
    });

    res.json({
      success: true,
      data: consumption
    });
  } catch (error) {
    console.error('Error generating consumption report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate consumption report',
      error: error.message
    });
  }
});

// Aging Report
router.get('/aging', async (req, res) => {
  try {
    const { location_id } = req.query;

    const whereClause = {};
    if (location_id) whereClause.location_id = location_id;

    // This would require additional fields like batch_date or expiry_date
    // For now, we'll use a simplified version
    const agingData = await StockBalance.findAll({
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
      order: [['quantity_on_hand', 'DESC']]
    });

    res.json({
      success: true,
      data: agingData
    });
  } catch (error) {
    console.error('Error generating aging report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate aging report',
      error: error.message
    });
  }
});

// Valuation Report
router.get('/valuation', async (req, res) => {
  try {
    const { location_id, valuation_method = 'fifo' } = req.query;

    const whereClause = {};
    if (location_id) whereClause.location_id = location_id;

    const valuation = await StockBalance.findAll({
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
      order: [['quantity_on_hand', 'DESC']]
    });

    // Calculate total valuation
    const totalValue = valuation.reduce((sum, item) => {
      return sum + (item.quantity_on_hand * (item.average_cost || 0));
    }, 0);

    res.json({
      success: true,
      data: {
        items: valuation,
        totalValue,
        valuationMethod: valuation_method
      }
    });
  } catch (error) {
    console.error('Error generating valuation report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate valuation report',
      error: error.message
    });
  }
});

// GRN Summary Report
router.get('/grn-summary', async (req, res) => {
  try {
    const { start_date, end_date, supplier_id, status } = req.query;

    const whereClause = {};
    if (supplier_id) whereClause.supplier_id = supplier_id;
    if (status) whereClause.status = status;
    if (start_date && end_date) {
      whereClause.received_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const grns = await GRN.findAll({
      where: whereClause,
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['supplier_id', 'supplier_name']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name']
        }
      ],
      order: [['received_date', 'DESC']]
    });

    res.json({
      success: true,
      data: grns
    });
  } catch (error) {
    console.error('Error generating GRN summary report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate GRN summary report',
      error: error.message
    });
  }
});

// Issuance Summary Report
router.get('/issuance-summary', async (req, res) => {
  try {
    const { start_date, end_date, issued_to, location_id } = req.query;

    const whereClause = {};
    if (issued_to) whereClause.issued_to = { [Op.like]: `%${issued_to}%` };
    if (location_id) whereClause.location_id = location_id;
    if (start_date && end_date) {
      whereClause.issued_date = {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      };
    }

    const issuances = await Issuance.findAll({
      where: whereClause,
      include: [
        {
          model: Requisition,
          as: 'requisition',
          attributes: ['requisition_id', 'requisition_number', 'from_department']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name']
        }
      ],
      order: [['issued_date', 'DESC']]
    });

    res.json({
      success: true,
      data: issuances
    });
  } catch (error) {
    console.error('Error generating issuance summary report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate issuance summary report',
      error: error.message
    });
  }
});

// Dashboard Statistics
router.get('/dashboard-stats', async (req, res) => {
  try {
    const [
      totalItems,
      lowStockItems,
      totalGRNs,
      totalIssuances,
      totalRequisitions
    ] = await Promise.all([
      StockBalance.count(),
      StockBalance.count({
        where: {
          quantity_available: { [Op.lt]: 10 }
        }
      }),
      GRN.count(),
      Issuance.count(),
      Requisition.count()
    ]);

    const stats = {
      totalItems,
      lowStockItems,
      totalGRNs,
      totalIssuances,
      totalRequisitions,
      lowStockPercentage: totalItems > 0 ? ((lowStockItems / totalItems) * 100).toFixed(2) : 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

module.exports = router;
