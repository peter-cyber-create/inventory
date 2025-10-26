
const express = require('express');
const auth = require('../../middleware/auth.js');
const { Item, Supplier, Location, User, StockBalance, AuditLog } = require('../../models/stores/index.js');
const { Op } = require('sequelize');

const router = express.Router();

// Audit logging function
const auditLog = async (action, entity, entityId, oldValues, newValues, req) => {
  const { AuditLog } = require('../../models/stores');
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

// Get all items with stock information
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { item_name: { [Op.like]: `%${search}%` } },
        { item_code: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (status !== 'all') {
      whereClause.is_active = status === 'active';
    }

    const { count, rows } = await Item.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['supplier_id', 'supplier_name', 'contact_person', 'phone_number']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name', 'location_code']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'firstname', 'lastname']
        },
        {
          model: StockBalance,
          as: 'stockBalances',
          attributes: ['current_quantity', 'available_quantity', 'total_value'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        items: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single item
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [
        {
          model: Supplier,
          as: 'supplier',
          attributes: ['supplier_id', 'supplier_name', 'contact_person', 'phone_number', 'email']
        },
        {
          model: Location,
          as: 'location',
          attributes: ['location_id', 'location_name', 'location_code', 'description']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'firstname', 'lastname']
        },
        {
          model: StockBalance,
          as: 'stockBalances',
          attributes: ['balance_id', 'batch_number', 'current_quantity', 'available_quantity', 'unit_cost', 'total_value', 'expiry_date'],
          include: [
            {
              model: Location,
              as: 'location',
              attributes: ['location_id', 'location_name', 'location_code']
            }
          ]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create new item
router.post('/', auth, async (req, res) => {
  try {
    const {
      item_code,
      item_name,
      category,
      sub_category,
      unit_of_measure,
      reorder_level,
      max_level,
      supplier_id,
      location_id,
      unit_cost,
      description
    } = req.body;

    // Check if item code already exists
    const existingItem = await Item.findOne({ where: { item_code } });
    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Item code already exists' });
    }

    const item = await Item.create({
      item_code,
      item_name,
      category,
      sub_category,
      unit_of_measure,
      reorder_level: reorder_level || 0,
      max_level,
      supplier_id,
      location_id,
      unit_cost: unit_cost || 0,
      description,
      created_by: req.user.id
    });

    // Log the creation
    await auditLog('CREATE', 'items', item.item_id, null, item.toJSON(), req);

    // Fetch the created item with associations
    const createdItem = await Item.findByPk(item.item_id, {
      include: [
        { model: Supplier, as: 'supplier', attributes: ['supplier_id', 'supplier_name'] },
        { model: Location, as: 'location', attributes: ['location_id', 'location_name'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstname', 'lastname'] }
      ]
    });

    res.status(201).json({ success: true, data: createdItem });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const oldValues = item.toJSON();
    
    const {
      item_code,
      item_name,
      category,
      sub_category,
      unit_of_measure,
      reorder_level,
      max_level,
      supplier_id,
      location_id,
      unit_cost,
      description,
      is_active
    } = req.body;

    // Check if item code already exists (excluding current item)
    if (item_code && item_code !== item.item_code) {
      const existingItem = await Item.findOne({ 
        where: { 
          item_code,
          item_id: { [Op.ne]: req.params.id }
        } 
      });
      if (existingItem) {
        return res.status(400).json({ success: false, message: 'Item code already exists' });
      }
    }

    await item.update({
      item_code: item_code || item.item_code,
      item_name: item_name || item.item_name,
      category: category || item.category,
      sub_category,
      unit_of_measure: unit_of_measure || item.unit_of_measure,
      reorder_level: reorder_level !== undefined ? reorder_level : item.reorder_level,
      max_level,
      supplier_id,
      location_id,
      unit_cost: unit_cost !== undefined ? unit_cost : item.unit_cost,
      description,
      is_active: is_active !== undefined ? is_active : item.is_active
    });

    // Log the update
    await auditLog('UPDATE', 'items', item.item_id, oldValues, item.toJSON(), req);

    // Fetch updated item with associations
    const updatedItem = await Item.findByPk(item.item_id, {
      include: [
        { model: Supplier, as: 'supplier', attributes: ['supplier_id', 'supplier_name'] },
        { model: Location, as: 'location', attributes: ['location_id', 'location_name'] },
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstname', 'lastname'] }
      ]
    });

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete item (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const oldValues = item.toJSON();
    
    await item.update({ is_active: false });

    // Log the deletion
    await auditLog('DELETE', 'items', item.item_id, oldValues, { is_active: false }, req);

    res.json({ success: true, message: 'Item deactivated successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get item categories
router.get('/categories/list', auth, async (req, res) => {
  try {
    const categories = await Item.findAll({
      attributes: ['category'],
      group: ['category'],
      where: { is_active: true }
    });

    const categoryList = categories.map(item => item.category);

    res.json({ success: true, data: categoryList });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get low stock items
router.get('/reports/low-stock', auth, async (req, res) => {
  try {
    const { sequelize } = require('../../config/db');
    
    const lowStockItems = await sequelize.query(`
      SELECT 
        i.item_id,
        i.item_code,
        i.item_name,
        i.category,
        i.reorder_level,
        COALESCE(SUM(sb.current_quantity), 0) as current_stock,
        s.supplier_name,
        l.location_name
      FROM items i
      LEFT JOIN stock_balances sb ON i.item_id = sb.item_id
      LEFT JOIN suppliers s ON i.supplier_id = s.supplier_id
      LEFT JOIN locations l ON i.location_id = l.location_id
      WHERE i.is_active = true
      GROUP BY i.item_id
      HAVING current_stock <= i.reorder_level
      ORDER BY (i.reorder_level - current_stock) DESC
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({ success: true, data: lowStockItems });
  } catch (error) {
    console.error('Low stock report error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
