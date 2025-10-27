const express = require('express');
const router = express.Router();

// Import the Form 76A routes
const form76aRoutes = require('./form76aRoutes');

// Mount Form 76A routes under requisition
router.use('/form76a', form76aRoutes);

// Additional requisition routes can be added here
// For example, different types of requisitions, approvals, etc.

// Get all requisition types
router.get('/types', async (req, res) => {
  try {
    const requisitionTypes = [
      {
        id: 'form76a',
        name: 'Form 76A - Stores Requisition/Issue Voucher',
        description: 'Official Ministry of Health requisition form',
        status: 'active'
      },
      {
        id: 'emergency',
        name: 'Emergency Requisition',
        description: 'Emergency stock requisition',
        status: 'active'
      },
      {
        id: 'maintenance',
        name: 'Maintenance Requisition',
        description: 'Maintenance and repair requisitions',
        status: 'active'
      }
    ];

    res.json({
      success: true,
      data: requisitionTypes
    });
  } catch (error) {
    console.error('Error fetching requisition types:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requisition types',
      error: error.message
    });
  }
});

// Get requisition statistics
router.get('/stats', async (req, res) => {
  try {
    const { Requisition } = require('../../models/stores');
    
    const stats = await Requisition.findAll({
      attributes: [
        'status',
        [Requisition.sequelize.fn('COUNT', Requisition.sequelize.col('requisition_id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const formattedStats = {
      total: stats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = parseInt(stat.count);
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('Error fetching requisition stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requisition statistics',
      error: error.message
    });
  }
});

module.exports = router;

