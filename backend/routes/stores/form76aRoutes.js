const express = require('express');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

const Requisition = require('../../models/stores/requisitionModel');
const RequisitionItem = require('../../models/stores/requisitionItemModel');
const RequisitionSignature = require('../../models/stores/requisitionSignatureModel');

const router = express.Router();

// Generate unique requisition serial number
const generateSerialNumber = async () => {
  const count = await Requisition.count();
  const paddedCount = String(count + 1).padStart(5, '0');
  return `REQ-${paddedCount}`;
};

// GET /api/requisitions - List all requisitions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, department, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (department) whereClause.department = { [Op.iLike]: `%${department}%` };
    if (date_from || date_to) {
      whereClause.requisition_date = {};
      if (date_from) whereClause.requisition_date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.requisition_date[Op.lte] = new Date(date_to);
    }

    const { count, rows } = await Requisition.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: RequisitionItem,
          as: 'items'
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching requisitions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requisitions',
      error: error.message
    });
  }
});

// GET /api/requisitions/:id - Get single requisition with items
router.get('/:id', async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id, {
      include: [
        {
          model: RequisitionItem,
          as: 'items',
          order: [['serial_no', 'ASC']]
        },
        {
          model: RequisitionSignature,
          as: 'signatures'
        }
      ]
    });

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: 'Requisition not found'
      });
    }

    res.json({
      success: true,
      data: requisition
    });

  } catch (error) {
    console.error('Error fetching requisition:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requisition',
      error: error.message
    });
  }
});

// POST /api/requisitions - Create new requisition with items
router.post('/', async (req, res) => {
  const transaction = await Requisition.sequelize.transaction();
  
  try {
    const serialNo = await generateSerialNumber();
    
    const requisitionData = {
      serial_no: serialNo,
      requisition_date: req.body.requisition_date || new Date(),
      department: req.body.department,
      destination: req.body.destination,
      purpose: req.body.purpose,
      status: req.body.status || 'Draft',
      created_by: (req.user && req.user.id) || 1
    };

    const requisition = await Requisition.create(requisitionData, { transaction });

    // Create requisition items
    if (req.body.items && Array.isArray(req.body.items)) {
      for (let i = 0; i < req.body.items.length; i++) {
        const item = req.body.items[i];
        await RequisitionItem.create({
          requisition_id: requisition.id,
          serial_no: i + 1,
          description: item.description,
          unit: item.unit,
          qty_ordered: item.qty_ordered,
          qty_approved: item.qty_approved || 0,
          qty_issued: item.qty_issued || 0,
          qty_received: item.qty_received || 0
        }, { transaction });
      }
    }

    // Create signature placeholders
    const signatureRoles = ['requisition_officer', 'approving_officer', 'issuing_officer', 'receiving_officer', 'head_of_department'];
    for (const role of signatureRoles) {
      await RequisitionSignature.create({
        requisition_id: requisition.id,
        role: role
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Requisition created successfully',
      data: requisition
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating requisition:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating requisition',
      error: error.message
    });
  }
});

// PUT /api/requisitions/:id - Update requisition details
router.put('/:id', async (req, res) => {
  const transaction = await Requisition.sequelize.transaction();
  
  try {
    const requisition = await Requisition.findByPk(req.params.id);
    if (!requisition) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Requisition not found'
      });
    }

    const updateData = {
      requisition_date: req.body.requisition_date,
      department: req.body.department,
      destination: req.body.destination,
      purpose: req.body.purpose,
      status: req.body.status
    };

    await requisition.update(updateData, { transaction });

    // Update items if provided
    if (req.body.items) {
      // Delete existing items
      await RequisitionItem.destroy({ where: { requisition_id: requisition.id }, transaction });
      
      // Create new items
      for (let i = 0; i < req.body.items.length; i++) {
        const item = req.body.items[i];
        await RequisitionItem.create({
          requisition_id: requisition.id,
          serial_no: i + 1,
          description: item.description,
          unit: item.unit,
          qty_ordered: item.qty_ordered,
          qty_approved: item.qty_approved || 0,
          qty_issued: item.qty_issued || 0,
          qty_received: item.qty_received || 0
        }, { transaction });
      }
    }

    await transaction.commit();

    res.json({
      success: true,
      message: 'Requisition updated successfully',
      data: requisition
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error updating requisition:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating requisition',
      error: error.message
    });
  }
});

// DELETE /api/requisitions/:id - Delete a requisition
router.delete('/:id', async (req, res) => {
  const transaction = await Requisition.sequelize.transaction();
  
  try {
    const requisition = await Requisition.findByPk(req.params.id);
    if (!requisition) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Requisition not found'
      });
    }

    // Delete related records
    await RequisitionItem.destroy({ where: { requisition_id: requisition.id }, transaction });
    await RequisitionSignature.destroy({ where: { requisition_id: requisition.id }, transaction });
    
    // Delete requisition
    await requisition.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Requisition deleted successfully'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting requisition:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting requisition',
      error: error.message
    });
  }
});

// POST /api/requisitions/:id/items - Add item(s) to requisition
router.post('/:id/items', async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id);
    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: 'Requisition not found'
      });
    }

    const items = Array.isArray(req.body) ? req.body : [req.body];
    const createdItems = [];

    for (const item of items) {
      const createdItem = await RequisitionItem.create({
        requisition_id: requisition.id,
        serial_no: item.serial_no,
        description: item.description,
        unit: item.unit,
        qty_ordered: item.qty_ordered,
        qty_approved: item.qty_approved || 0,
        qty_issued: item.qty_issued || 0,
        qty_received: item.qty_received || 0
      });
      createdItems.push(createdItem);
    }

    res.status(201).json({
      success: true,
      message: 'Items added successfully',
      data: createdItems
    });

  } catch (error) {
    console.error('Error adding items:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding items',
      error: error.message
    });
  }
});

// DELETE /api/requisitions/items/:item_id - Remove a specific item
router.delete('/items/:item_id', async (req, res) => {
  try {
    const item = await RequisitionItem.findByPk(req.params.item_id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.destroy();

    res.json({
      success: true,
      message: 'Item removed successfully'
    });

  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item',
      error: error.message
    });
  }
});

// GET /api/requisitions/print/:id - Generate printable PDF layout
router.get('/print/:id', async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id, {
      include: [
        {
          model: RequisitionItem,
          as: 'items',
          order: [['serial_no', 'ASC']]
        },
        {
          model: RequisitionSignature,
          as: 'signatures'
        }
      ]
    });

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: 'Requisition not found'
      });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Form76A-${requisition.serial_no}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('MINISTRY OF HEALTH', 50, 50, { align: 'center' });
    doc.fontSize(14).text('STORES REQUISITION / ISSUE VOUCHER (Form 76A)', 50, 70, { align: 'center' });
    
    // Form Details
    doc.fontSize(10).font('Helvetica');
    let yPosition = 120;
    
    doc.text(`Serial No.: ${requisition.serial_no}`, 50, yPosition);
    doc.text(`Date: ${new Date(requisition.requisition_date).toLocaleDateString()}`, 300, yPosition);
    yPosition += 20;
    
    doc.text(`From Department/Unit: ${requisition.department}`, 50, yPosition);
    doc.text(`To (Store/Receiving Section): ${requisition.destination || 'N/A'}`, 300, yPosition);
    yPosition += 20;
    
    doc.text(`Purpose / Remarks: ${requisition.purpose || 'N/A'}`, 50, yPosition);
    yPosition += 30;

    // Items Table Header
    doc.font('Helvetica-Bold');
    doc.text('Serial No.', 50, yPosition);
    doc.text('Description', 100, yPosition);
    doc.text('Unit of Issue', 300, yPosition);
    doc.text('Qty Ordered', 380, yPosition);
    doc.text('Qty Approved', 460, yPosition);
    doc.text('Qty Issued', 540, yPosition);
    doc.text('Qty Received', 620, yPosition);
    yPosition += 20;

    // Items Table Content
    doc.font('Helvetica');
    requisition.items.forEach(item => {
      doc.text(item.serial_no.toString(), 50, yPosition);
      doc.text(item.description, 100, yPosition, { width: 190 });
      doc.text(item.unit || 'N/A', 300, yPosition);
      doc.text(item.qty_ordered.toString(), 380, yPosition);
      doc.text(item.qty_approved.toString(), 460, yPosition);
      doc.text(item.qty_issued.toString(), 540, yPosition);
      doc.text(item.qty_received.toString(), 620, yPosition);
      yPosition += 20;
    });

    yPosition += 30;

    // Signatures Section
    doc.font('Helvetica-Bold').text('SIGNATURES', 50, yPosition);
    yPosition += 30;

    const signatureRoles = [
      'Requisition Officer',
      'Approving Officer',
      'Issuing Officer',
      'Receiving Officer',
      'Head of Department/Unit'
    ];

    signatureRoles.forEach((role, index) => {
      doc.font('Helvetica').text(`${role}:`, 50, yPosition);
      doc.text('Name: ___________________________', 200, yPosition);
      doc.text('Signature: _____________________', 400, yPosition);
      doc.text('Date: ___________', 550, yPosition);
      yPosition += 30;
    });

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message
    });
  }
});

module.exports = router;