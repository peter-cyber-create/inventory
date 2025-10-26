const express = require('express');
const router = express.Router();
const { GRN, Item, Supplier, Location, StockLedger, StockBalance } = require('../../models/stores');
const { Op } = require('sequelize');

// Create a new GRN
router.post('/', async (req, res) => {
  const t = await GRN.sequelize.transaction();
  try {
    const { 
      grn_number,
      supplier_id,
      received_date,
      received_by,
      location_id,
      items,
      total_amount,
      remarks
    } = req.body;

    // Create GRN
    const grn = await GRN.create({
      grn_number,
      supplier_id,
      received_date: received_date || new Date(),
      received_by,
      location_id,
      total_amount: total_amount || 0,
      remarks,
      status: 'pending'
    }, { transaction: t });

    // Create GRN items and update stock
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        // Create GRN item record
        await GRN.create({
          grn_id: grn.grn_id,
          item_id: item.item_id,
          quantity_received: item.quantity_received,
          unit_cost: item.unit_cost,
          total_cost: item.quantity_received * item.unit_cost,
          batch_number: item.batch_number,
          expiry_date: item.expiry_date,
          condition: item.condition || 'good'
        }, { transaction: t });

        // Update stock balance
        const [stockBalance, created] = await StockBalance.findOrCreate({
          where: {
            item_id: item.item_id,
            location_id: location_id
          },
          defaults: {
            item_id: item.item_id,
            location_id: location_id,
            quantity_on_hand: 0,
            quantity_reserved: 0,
            quantity_available: 0
          },
          transaction: t
        });

        await stockBalance.update({
          quantity_on_hand: stockBalance.quantity_on_hand + item.quantity_received,
          quantity_available: stockBalance.quantity_on_hand + item.quantity_received - stockBalance.quantity_reserved
        }, { transaction: t });

        // Create stock ledger entry
        await StockLedger.create({
          item_id: item.item_id,
          location_id: location_id,
          transaction_type: 'receipt',
          reference_type: 'grn',
          reference_id: grn.grn_id,
          quantity: item.quantity_received,
          unit_cost: item.unit_cost,
          total_cost: item.quantity_received * item.unit_cost,
          balance_after: stockBalance.quantity_on_hand + item.quantity_received,
          remarks: `GRN ${grn_number} - Received from supplier`
        }, { transaction: t });
      }
    }

    await t.commit();
    
    res.status(201).json({
      success: true,
      message: 'GRN created successfully',
      data: {
        grn_id: grn.grn_id,
        grn_number: grn.grn_number
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating GRN:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create GRN',
      error: error.message
    });
  }
});

// Get all GRNs
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { grn_number: { [Op.like]: `%${search}%` } },
        { remarks: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: grns } = await GRN.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['supplier_id', 'supplier_name', 'contact_person']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name']
        }
      ],
      limit,
      offset,
      order: [['received_date', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        grns,
        pagination: {
          current: page,
          pageSize: limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching GRNs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GRNs',
      error: error.message
    });
  }
});

// Get single GRN by ID
router.get('/:id', async (req, res) => {
  try {
    const grn = await GRN.findByPk(req.params.id, {
      include: [
        {
          model: Supplier,
          as: 'supplier'
        },
        {
          model: Location,
          as: 'location'
        },
        {
          model: Item,
          as: 'items',
          through: {
            attributes: ['quantity_received', 'unit_cost', 'total_cost', 'batch_number', 'expiry_date', 'condition']
          }
        }
      ]
    });

    if (!grn) {
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    res.json({
      success: true,
      data: grn
    });
  } catch (error) {
    console.error('Error fetching GRN:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GRN',
      error: error.message
    });
  }
});

// Update GRN status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected'
      });
    }

    const grn = await GRN.findByPk(req.params.id);
    if (!grn) {
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    await grn.update({ 
      status,
      approved_at: status === 'approved' ? new Date() : null,
      approved_by: status === 'approved' ? req.user?.id : null
    });

    res.json({
      success: true,
      message: `GRN status updated to ${status}`,
      data: { status: grn.status }
    });
  } catch (error) {
    console.error('Error updating GRN status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update GRN status',
      error: error.message
    });
  }
});

// Delete GRN
router.delete('/:id', async (req, res) => {
  const t = await GRN.sequelize.transaction();
  try {
    const grn = await GRN.findByPk(req.params.id);
    if (!grn) {
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    // Reverse stock entries if GRN was approved
    if (grn.status === 'approved') {
      // This would require reversing stock ledger entries
      // Implementation depends on business rules
    }

    await grn.destroy({ transaction: t });
    await t.commit();
    
    res.json({
      success: true,
      message: 'GRN deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting GRN:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete GRN',
      error: error.message
    });
  }
});

module.exports = router;
