const express = require('express');
const router = express.Router();
const { Issuance, Requisition, RequisitionItem, Item, Location, StockLedger, StockBalance } = require('../../models/stores');
const { Op } = require('sequelize');

// Create a new issuance
router.post('/', async (req, res) => {
  const t = await Issuance.sequelize.transaction();
  try {
    const { 
      issuance_number,
      requisition_id,
      issued_to,
      issued_by,
      location_id,
      issued_date,
      items,
      remarks
    } = req.body;

    // Create issuance
    const issuance = await Issuance.create({
      issuance_number,
      requisition_id,
      issued_to,
      issued_by,
      location_id,
      issued_date: issued_date || new Date(),
      remarks,
      status: 'completed'
    }, { transaction: t });

    // Process issuance items and update stock
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        // Create issuance item record
        await Issuance.create({
          issuance_id: issuance.issuance_id,
          item_id: item.item_id,
          quantity_issued: item.quantity_issued,
          unit_cost: item.unit_cost,
          total_cost: item.quantity_issued * item.unit_cost,
          batch_number: item.batch_number
        }, { transaction: t });

        // Update stock balance
        const stockBalance = await StockBalance.findOne({
          where: {
            item_id: item.item_id,
            location_id: location_id
          },
          transaction: t
        });

        if (!stockBalance) {
          throw new Error(`Stock balance not found for item ${item.item_id} at location ${location_id}`);
        }

        if (stockBalance.quantity_available < item.quantity_issued) {
          throw new Error(`Insufficient stock for item ${item.item_id}. Available: ${stockBalance.quantity_available}, Required: ${item.quantity_issued}`);
        }

        await stockBalance.update({
          quantity_on_hand: stockBalance.quantity_on_hand - item.quantity_issued,
          quantity_available: stockBalance.quantity_available - item.quantity_issued
        }, { transaction: t });

        // Create stock ledger entry
        await StockLedger.create({
          item_id: item.item_id,
          location_id: location_id,
          transaction_type: 'issue',
          reference_type: 'issuance',
          reference_id: issuance.issuance_id,
          quantity: -item.quantity_issued, // Negative for issuance
          unit_cost: item.unit_cost,
          total_cost: item.quantity_issued * item.unit_cost,
          balance_after: stockBalance.quantity_on_hand - item.quantity_issued,
          remarks: `Issuance ${issuance_number} - Issued to ${issued_to}`
        }, { transaction: t });

        // Update requisition item status
        if (requisition_id) {
          await RequisitionItem.update(
            { 
              quantity_issued: item.quantity_issued,
              status: 'completed'
            },
            {
              where: {
                requisition_id: requisition_id,
                item_id: item.item_id
              },
              transaction: t
            }
          );
        }
      }
    }

    await t.commit();
    
    res.status(201).json({
      success: true,
      message: 'Issuance created successfully',
      data: {
        issuance_id: issuance.issuance_id,
        issuance_number: issuance.issuance_number
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating issuance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create issuance',
      error: error.message
    });
  }
});

// Get all issuances
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
        { issuance_number: { [Op.like]: `%${search}%` } },
        { issued_to: { [Op.like]: `%${search}%` } },
        { remarks: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: issuances } = await Issuance.findAndCountAll({
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
      limit,
      offset,
      order: [['issued_date', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        issuances,
        pagination: {
          current: page,
          pageSize: limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching issuances:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issuances',
      error: error.message
    });
  }
});

// Get single issuance by ID
router.get('/:id', async (req, res) => {
  try {
    const issuance = await Issuance.findByPk(req.params.id, {
      include: [
        {
          model: Requisition,
          as: 'requisition'
        },
        {
          model: Location,
          as: 'location'
        },
        {
          model: Item,
          as: 'items',
          through: {
            attributes: ['quantity_issued', 'unit_cost', 'total_cost', 'batch_number']
          }
        }
      ]
    });

    if (!issuance) {
      return res.status(404).json({
        success: false,
        message: 'Issuance not found'
      });
    }

    res.json({
      success: true,
      data: issuance
    });
  } catch (error) {
    console.error('Error fetching issuance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issuance',
      error: error.message
    });
  }
});

// Get issuances for a specific requisition
router.get('/requisition/:requisition_id', async (req, res) => {
  try {
    const { requisition_id } = req.params;

    const issuances = await Issuance.findAll({
      where: { requisition_id },
      include: [
        {
          model: Item,
          as: 'items',
          through: {
            attributes: ['quantity_issued', 'unit_cost', 'total_cost']
          }
        }
      ],
      order: [['issued_date', 'DESC']]
    });

    res.json({
      success: true,
      data: issuances
    });
  } catch (error) {
    console.error('Error fetching requisition issuances:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requisition issuances',
      error: error.message
    });
  }
});

// Update issuance
router.put('/:id', async (req, res) => {
  try {
    const { remarks, status } = req.body;

    const issuance = await Issuance.findByPk(req.params.id);
    if (!issuance) {
      return res.status(404).json({
        success: false,
        message: 'Issuance not found'
      });
    }

    await issuance.update({
      remarks: remarks || issuance.remarks,
      status: status || issuance.status
    });

    res.json({
      success: true,
      message: 'Issuance updated successfully'
    });
  } catch (error) {
    console.error('Error updating issuance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issuance',
      error: error.message
    });
  }
});

// Delete issuance
router.delete('/:id', async (req, res) => {
  const t = await Issuance.sequelize.transaction();
  try {
    const issuance = await Issuance.findByPk(req.params.id);
    if (!issuance) {
      return res.status(404).json({
        success: false,
        message: 'Issuance not found'
      });
    }

    // Reverse stock entries
    const issuanceItems = await Issuance.findAll({
      where: { issuance_id: issuance.issuance_id },
      transaction: t
    });

    for (const item of issuanceItems) {
      // Reverse stock balance
      const stockBalance = await StockBalance.findOne({
        where: {
          item_id: item.item_id,
          location_id: issuance.location_id
        },
        transaction: t
      });

      if (stockBalance) {
        await stockBalance.update({
          quantity_on_hand: stockBalance.quantity_on_hand + item.quantity_issued,
          quantity_available: stockBalance.quantity_available + item.quantity_issued
        }, { transaction: t });
      }

      // Create reversal ledger entry
      await StockLedger.create({
        item_id: item.item_id,
        location_id: issuance.location_id,
        transaction_type: 'adjustment',
        reference_type: 'issuance_reversal',
        reference_id: issuance.issuance_id,
        quantity: item.quantity_issued,
        unit_cost: item.unit_cost,
        total_cost: item.quantity_issued * item.unit_cost,
        balance_after: stockBalance.quantity_on_hand + item.quantity_issued,
        remarks: `Reversal of issuance ${issuance.issuance_number}`
      }, { transaction: t });
    }

    await issuance.destroy({ transaction: t });
    await t.commit();
    
    res.json({
      success: true,
      message: 'Issuance deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting issuance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete issuance',
      error: error.message
    });
  }
});

module.exports = router;

