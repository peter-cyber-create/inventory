
const express = require('express');
const auth = require('../../middleware/auth.js');
const { Supplier, User, AuditLog } = require('../../models/stores/index.js');
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

// Get all suppliers
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { supplier_name: { [Op.like]: `%${search}%` } },
        { contact_person: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status !== 'all') {
      whereClause.is_active = status === 'active';
    }

    const { count, rows } = await Supplier.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'firstname', 'lastname']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        suppliers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single supplier
router.get('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'firstname', 'lastname']
        }
      ]
    });

    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    res.json({ success: true, data: supplier });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create new supplier
router.post('/', auth, async (req, res) => {
  try {
    const {
      supplier_name,
      contact_person,
      phone_number,
      email,
      address,
      tin_number
    } = req.body;

    // Check if supplier name already exists
    const existingSupplier = await Supplier.findOne({ 
      where: { supplier_name: { [Op.iLike]: supplier_name } }
    });
    if (existingSupplier) {
      return res.status(400).json({ success: false, message: 'Supplier name already exists' });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await Supplier.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
    }

    const supplier = await Supplier.create({
      supplier_name,
      contact_person,
      phone_number,
      email,
      address,
      tin_number,
      created_by: req.user.id
    });

    // Log the creation
    await auditLog('CREATE', 'suppliers', supplier.supplier_id, null, supplier.toJSON(), req);

    // Fetch the created supplier with associations
    const createdSupplier = await Supplier.findByPk(supplier.supplier_id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstname', 'lastname'] }
      ]
    });

    res.status(201).json({ success: true, data: createdSupplier });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update supplier
router.put('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    const oldValues = supplier.toJSON();
    
    const {
      supplier_name,
      contact_person,
      phone_number,
      email,
      address,
      tin_number,
      is_active
    } = req.body;

    // Check if supplier name already exists (excluding current supplier)
    if (supplier_name && supplier_name !== supplier.supplier_name) {
      const existingSupplier = await Supplier.findOne({ 
        where: { 
          supplier_name: { [Op.iLike]: supplier_name },
          supplier_id: { [Op.ne]: req.params.id }
        } 
      });
      if (existingSupplier) {
        return res.status(400).json({ success: false, message: 'Supplier name already exists' });
      }
    }

    // Check if email already exists (excluding current supplier)
    if (email && email !== supplier.email) {
      const existingEmail = await Supplier.findOne({ 
        where: { 
          email,
          supplier_id: { [Op.ne]: req.params.id }
        } 
      });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
    }

    await supplier.update({
      supplier_name: supplier_name || supplier.supplier_name,
      contact_person,
      phone_number,
      email,
      address,
      tin_number,
      is_active: is_active !== undefined ? is_active : supplier.is_active
    });

    // Log the update
    await auditLog('UPDATE', 'suppliers', supplier.supplier_id, oldValues, supplier.toJSON(), req);

    // Fetch updated supplier with associations
    const updatedSupplier = await Supplier.findByPk(supplier.supplier_id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstname', 'lastname'] }
      ]
    });

    res.json({ success: true, data: updatedSupplier });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete supplier (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    // Check if supplier has associated items
    const { Item } = require('../../models/stores');
    const associatedItems = await Item.count({ where: { supplier_id: req.params.id } });
    
    if (associatedItems > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete supplier with associated items. Deactivate instead.' 
      });
    }

    const oldValues = supplier.toJSON();
    
    await supplier.update({ is_active: false });

    // Log the deletion
    await auditLog('DELETE', 'suppliers', supplier.supplier_id, oldValues, { is_active: false }, req);

    res.json({ success: true, message: 'Supplier deactivated successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get active suppliers (for dropdowns)
router.get('/list/active', auth, async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      where: { is_active: true },
      attributes: ['supplier_id', 'supplier_name', 'contact_person', 'phone_number'],
      order: [['supplier_name', 'ASC']]
    });

    res.json({ success: true, data: suppliers });
  } catch (error) {
    console.error('Get active suppliers error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
