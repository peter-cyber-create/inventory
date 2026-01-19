const express = require('express');
const { sequelize } = require('../../config/db');
const { Op } = require('sequelize');
const Requisition = require('../../models/stores/requisitionModel');
const RequisitionItem = require('../../models/stores/requisitionItemModel');
const router = express.Router();

// GET /api/stores/form76a - List all requisitions with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      department_id,
      created_by,
      search 
    } = req.query;

    const offset = (page - 1) * parseInt(limit);
    const where = {};

    // Apply filters
    if (status) {
      where.status = status;
    }
    if (department_id) {
      where.department_id = parseInt(department_id);
    }
    if (created_by) {
      where.created_by = parseInt(created_by);
    }

    // Build search condition
    let searchCondition = {};
    if (search) {
      searchCondition = {
        [Op.or]: [
          { requisition_number: { [Op.iLike]: `%${search}%` } },
          { from_department: { [Op.iLike]: `%${search}%` } },
          { purpose_remarks: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    // Get total count
    const total = await Requisition.count({
      where: { ...where, ...searchCondition }
    });

    // Get requisitions
    const requisitions = await Requisition.findAll({
      where: { ...where, ...searchCondition },
      include: [{
        model: RequisitionItem,
        as: 'items',
        required: false
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.status(200).json({
      status: 'success',
      data: requisitions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    // Log errors securely - don't log full error objects in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching requisitions:', error);
    } else {
      console.error('Error fetching requisitions:', error.message);
    }
    res.status(500).json({
      status: 'error',
      message: 'Error fetching requisitions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/stores/form76a/:id - Get single requisition
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const requisition = await Requisition.findByPk(id, {
      include: [{
        model: RequisitionItem,
        as: 'items',
        required: false
      }]
    });

    if (!requisition) {
      return res.status(404).json({
        status: 'error',
        message: 'Requisition not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: requisition
    });
  } catch (error) {
    // Log errors securely - don't log full error objects in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching requisition:', error);
    } else {
      console.error('Error fetching requisition:', error.message);
    }
    res.status(500).json({
      status: 'error',
      message: 'Error fetching requisition',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/stores/form76a - Create new requisition
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      requisition_number,
      from_department,
      to_department,
      purpose_remarks,
      requested_by,
      department_id,
      status = 'pending',
      items = []
    } = req.body;

    // Validate required fields
    if (!from_department || !to_department || !purpose_remarks || !requested_by) {
      await transaction.rollback();
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: from_department, to_department, purpose_remarks, requested_by'
      });
    }

    // Generate requisition number if not provided
    const reqNumber = requisition_number || `REQ-${new Date().getFullYear()}-${Date.now()}`;
    
    // Generate serial number for Form 76A
    const serialNo = requisition_number || `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Use parameterized query to prevent SQL injection
    const requisition = await Requisition.create({
      requisition_number: reqNumber,
      serial_no: serialNo,
      from_department,
      to_store: to_department,
      purpose_remarks,
      requested_by: parseInt(requested_by) || requested_by,
      department_id: department_id ? parseInt(department_id) : null,
      status,
      form_date: new Date()
    }, { transaction });

    // Handle requisition items if provided
    if (items && Array.isArray(items) && items.length > 0) {
      const requisitionItems = items.map((item, index) => ({
        requisition_id: requisition.requisition_id,
        serial_no: index + 1,
        description: item.description || '',
        unit_of_issue: item.unit || item.unitOfIssue || '',
        quantity_ordered: parseInt(item.qty_ordered || item.quantityOrdered || 0),
        quantity_approved: parseInt(item.qty_approved || item.quantityApproved || 0),
        quantity_issued: parseInt(item.qty_issued || item.quantityIssued || 0),
        quantity_received: parseInt(item.qty_received || item.quantityReceived || 0),
        item_id: item.item_id || null,
        quantity_requested: parseInt(item.quantity_requested || item.quantityOrdered || 0),
        unit_cost: parseFloat(item.unit_cost || 0) || null,
        total_cost: parseFloat(item.total_cost || 0) || null,
        justification: item.justification || null,
        status: 'pending'
      }));

      await RequisitionItem.bulkCreate(requisitionItems, { transaction });
    }

    await transaction.commit();

    // Fetch the created requisition with items
    const createdRequisition = await Requisition.findByPk(requisition.requisition_id, {
      include: [{
        model: RequisitionItem,
        as: 'items',
        required: false
      }]
    });

    res.status(201).json({
      status: 'success',
      message: 'Requisition created successfully',
      data: createdRequisition
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating requisition:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating requisition',
      error: error.message
    });
  }
});

// PUT /api/stores/form76a/:id - Update requisition
router.put('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { items, ...updateData } = req.body;

    const requisition = await Requisition.findByPk(id, { transaction });

    if (!requisition) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Requisition not found'
      });
    }

    // Update requisition fields (sanitize to_department to to_store)
    if (updateData.to_department) {
      updateData.to_store = updateData.to_department;
      delete updateData.to_department;
    }

    // Remove id from update data
    delete updateData.id;
    delete updateData.requisition_id;

    await requisition.update(updateData, { transaction });

    // Update items if provided
    if (items && Array.isArray(items)) {
      // Delete existing items
      await RequisitionItem.destroy({
        where: { requisition_id: id },
        transaction
      });

      // Create new items
      if (items.length > 0) {
        const requisitionItems = items.map((item, index) => ({
          requisition_id: parseInt(id),
          serial_no: index + 1,
          description: item.description || '',
          unit_of_issue: item.unit || item.unitOfIssue || '',
          quantity_ordered: parseInt(item.qty_ordered || item.quantityOrdered || 0),
          quantity_approved: parseInt(item.qty_approved || item.quantityApproved || 0),
          quantity_issued: parseInt(item.qty_issued || item.quantityIssued || 0),
          quantity_received: parseInt(item.qty_received || item.quantityReceived || 0),
          item_id: item.item_id || null,
          quantity_requested: parseInt(item.quantity_requested || item.quantityOrdered || 0),
          unit_cost: parseFloat(item.unit_cost || 0) || null,
          total_cost: parseFloat(item.total_cost || 0) || null,
          justification: item.justification || null,
          status: item.status || 'pending'
        }));

        await RequisitionItem.bulkCreate(requisitionItems, { transaction });
      }
    }

    await transaction.commit();

    // Fetch updated requisition with items
    const updatedRequisition = await Requisition.findByPk(id, {
      include: [{
        model: RequisitionItem,
        as: 'items',
        required: false
      }]
    });

    res.status(200).json({
      status: 'success',
      message: 'Requisition updated successfully',
      data: updatedRequisition
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating requisition:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating requisition',
      error: error.message
    });
  }
});

// DELETE /api/stores/form76a/:id - Delete requisition
router.delete('/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const requisition = await Requisition.findByPk(id, { transaction });

    if (!requisition) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Requisition not found'
      });
    }

    // Delete associated items first
    await RequisitionItem.destroy({
      where: { requisition_id: id },
      transaction
    });

    // Delete requisition
    await requisition.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({
      status: 'success',
      message: 'Requisition deleted successfully',
      data: requisition
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting requisition:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting requisition',
      error: error.message
    });
  }
});

// PATCH /api/stores/form76a/:id/status - Update requisition status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status is required'
      });
    }

    const requisition = await Requisition.findByPk(id);

    if (!requisition) {
      return res.status(404).json({
        status: 'error',
        message: 'Requisition not found'
      });
    }

    // Update status and set timestamp based on status
    const updateData = { status };
    if (remarks) {
      updateData.rejection_reason = remarks;
    }

    // Set workflow timestamps
    const now = new Date();
    if (status === 'submitted' && !requisition.submitted_at) {
      updateData.submitted_at = now;
    } else if (status === 'approved' && !requisition.approved_at) {
      updateData.approved_at = now;
    } else if (status === 'issued' && !requisition.issued_at) {
      updateData.issued_at = now;
    } else if (status === 'closed' && !requisition.closed_at) {
      updateData.closed_at = now;
    } else if (status === 'printed' && !requisition.printed_at) {
      updateData.printed_at = now;
    }

    await requisition.update(updateData);

    const updatedRequisition = await Requisition.findByPk(id, {
      include: [{
        model: RequisitionItem,
        as: 'items',
        required: false
      }]
    });

    res.status(200).json({
      status: 'success',
      message: 'Requisition status updated successfully',
      data: updatedRequisition
    });
  } catch (error) {
    console.error('Error updating requisition status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating requisition status',
      error: error.message
    });
  }
});

module.exports = router;