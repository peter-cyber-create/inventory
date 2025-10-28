const express = require('express');
const { sequelize } = require('../../config/db');
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

    const offset = (page - 1) * limit;
    let whereClause = 'WHERE 1=1';
    const params = [];

    // Apply filters
    if (status) {
      whereClause += ' AND status = $' + (params.length + 1);
      params.push(status);
    }
    if (department_id) {
      whereClause += ' AND department_id = $' + (params.length + 1);
      params.push(department_id);
    }
    if (created_by) {
      whereClause += ' AND created_by = $' + (params.length + 1);
      params.push(created_by);
    }
    if (search) {
      whereClause += ' AND (requisition_number ILIKE $' + (params.length + 1) + 
                    ' OR from_department ILIKE $' + (params.length + 2) + 
                    ' OR purpose_remarks ILIKE $' + (params.length + 3) + ')';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM requisitions';
    const countResult = await sequelize.query(countQuery, {
      type: sequelize.QueryTypes.SELECT
    });
    const total = countResult[0].total;

    // Get requisitions
    const query = `
      SELECT * FROM requisitions 
      ORDER BY created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;

    const requisitions = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    res.status(200).json({
      status: 'success',
      data: requisitions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching requisitions:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching requisitions',
      error: error.message
    });
  }
});

// GET /api/stores/form76a/:id - Get single requisition
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM requisitions WHERE id = $1';
    const result = await sequelize.query(query, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Requisition not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching requisition:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching requisition',
      error: error.message
    });
  }
});

// POST /api/stores/form76a - Create new requisition
router.post('/', async (req, res) => {
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
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: from_department, to_department, purpose_remarks, requested_by'
      });
    }

    // Generate requisition number if not provided
    const reqNumber = requisition_number || `REQ-${Date.now()}`;

    // Use direct string interpolation for simplicity
    const query = `
      INSERT INTO requisitions (
        requisition_number, from_department, to_department, 
        purpose_remarks, requested_by, department_id, status,
        created_at, updated_at
      ) VALUES ('${reqNumber}', '${from_department}', '${to_department}', '${purpose_remarks}', '${requested_by}', ${department_id || 1}, '${status}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.INSERT
    });

    // TODO: Handle items array - create separate table for requisition items
    // For now, we'll just store the requisition header

    res.status(201).json({
      status: 'success',
      message: 'Requisition created successfully',
      data: result[0]
    });
  } catch (error) {
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
  try {
    const { id } = req.params;
    const updateData = req.body;

    const setClause = [];
    const params = [];
    let paramIndex = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'id') {
        setClause.push(`${key} = $${paramIndex}`);
        params.push(updateData[key]);
        paramIndex++;
      }
    });

    if (setClause.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }

    setClause.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `
      UPDATE requisitions 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.UPDATE
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Requisition not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Requisition updated successfully',
      data: result[0]
    });
  } catch (error) {
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
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM requisitions 
      WHERE id = $1
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Requisition not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Requisition deleted successfully',
      data: result[0]
    });
  } catch (error) {
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

    const query = `
      UPDATE requisitions 
      SET status = $1, remarks = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      replacements: [status, remarks, id],
      type: sequelize.QueryTypes.UPDATE
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Requisition not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Requisition status updated successfully',
      data: result[0]
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