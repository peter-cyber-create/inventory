
const express = require('express');
const auth = require('../../middleware/auth.js');
const { Location, User, AuditLog } = require('../../models/stores/index.js');
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

// Get all locations
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { location_name: { [Op.like]: `%${search}%` } },
        { location_code: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (status !== 'all') {
      whereClause.is_active = status === 'active';
    }

    const { count, rows } = await Location.findAndCountAll({
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
        locations: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get single location
router.get('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'firstname', 'lastname']
        }
      ]
    });

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Create new location
router.post('/', auth, async (req, res) => {
  try {
    const {
      location_name,
      location_code,
      description,
      capacity
    } = req.body;

    // Check if location name already exists
    const existingLocation = await Location.findOne({ 
      where: { location_name: { [Op.iLike]: location_name } }
    });
    if (existingLocation) {
      return res.status(400).json({ success: false, message: 'Location name already exists' });
    }

    // Check if location code already exists (if provided)
    if (location_code) {
      const existingCode = await Location.findOne({ where: { location_code } });
      if (existingCode) {
        return res.status(400).json({ success: false, message: 'Location code already exists' });
      }
    }

    const location = await Location.create({
      location_name,
      location_code,
      description,
      capacity,
      created_by: req.user.id
    });

    // Log the creation
    await auditLog('CREATE', 'locations', location.location_id, null, location.toJSON(), req);

    // Fetch the created location with associations
    const createdLocation = await Location.findByPk(location.location_id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstname', 'lastname'] }
      ]
    });

    res.status(201).json({ success: true, data: createdLocation });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update location
router.put('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    const oldValues = location.toJSON();
    
    const {
      location_name,
      location_code,
      description,
      capacity,
      is_active
    } = req.body;

    // Check if location name already exists (excluding current location)
    if (location_name && location_name !== location.location_name) {
      const existingLocation = await Location.findOne({ 
        where: { 
          location_name: { [Op.iLike]: location_name },
          location_id: { [Op.ne]: req.params.id }
        } 
      });
      if (existingLocation) {
        return res.status(400).json({ success: false, message: 'Location name already exists' });
      }
    }

    // Check if location code already exists (excluding current location)
    if (location_code && location_code !== location.location_code) {
      const existingCode = await Location.findOne({ 
        where: { 
          location_code,
          location_id: { [Op.ne]: req.params.id }
        } 
      });
      if (existingCode) {
        return res.status(400).json({ success: false, message: 'Location code already exists' });
      }
    }

    await location.update({
      location_name: location_name || location.location_name,
      location_code,
      description,
      capacity,
      is_active: is_active !== undefined ? is_active : location.is_active
    });

    // Log the update
    await auditLog('UPDATE', 'locations', location.location_id, oldValues, location.toJSON(), req);

    // Fetch updated location with associations
    const updatedLocation = await Location.findByPk(location.location_id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'username', 'firstname', 'lastname'] }
      ]
    });

    res.json({ success: true, data: updatedLocation });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Delete location (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    // Check if location has associated items
    const { Item } = require('../../models/stores');
    const associatedItems = await Item.count({ where: { location_id: req.params.id } });
    
    if (associatedItems > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete location with associated items. Deactivate instead.' 
      });
    }

    const oldValues = location.toJSON();
    
    await location.update({ is_active: false });

    // Log the deletion
    await auditLog('DELETE', 'locations', location.location_id, oldValues, { is_active: false }, req);

    res.json({ success: true, message: 'Location deactivated successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get active locations (for dropdowns)
router.get('/list/active', auth, async (req, res) => {
  try {
    const locations = await Location.findAll({
      where: { is_active: true },
      attributes: ['location_id', 'location_name', 'location_code', 'capacity'],
      order: [['location_name', 'ASC']]
    });

    res.json({ success: true, data: locations });
  } catch (error) {
    console.error('Get active locations error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
