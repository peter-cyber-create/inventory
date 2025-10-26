const express = require('express');
const router = express.Router();
const { Requisition, RequisitionItem, RequisitionSignature } = require('../../models/stores');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate unique serial number for Form 76A
const generateSerialNumber = async () => {
  const year = new Date().getFullYear();
  const prefix = `REQ-${year}`;
  
  // Get the last requisition number for this year
  const lastRequisition = await Requisition.findOne({
    where: {
      serial_no: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['serial_no', 'DESC']]
  });

  let nextNumber = 1;
  if (lastRequisition) {
    const lastNumber = parseInt(lastRequisition.serial_no.split('-')[2]);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}-${nextNumber.toString().padStart(6, '0')}`;
};

// Create a new Form 76A requisition
router.post('/', async (req, res) => {
  const t = await Requisition.sequelize.transaction();
  try {
    const { 
      formDate, 
      fromDepartment, 
      toStore, 
      purposeRemarks, 
      items 
    } = req.body;

    // Generate serial number
    const serialNo = await generateSerialNumber();

    // Create requisition
    const requisition = await Requisition.create({
      serial_no: serialNo,
      requisition_number: serialNo,
      form_date: formDate || new Date(),
      from_department: fromDepartment,
      to_store: toStore,
      purpose_remarks: purposeRemarks,
      status: 'draft',
      requested_by: req.user?.id || 1 // Should come from auth middleware
    }, { transaction: t });

    // Create items with auto-increment serial numbers
    if (Array.isArray(items) && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await RequisitionItem.create({
          requisition_id: requisition.requisition_id,
          serial_no: i + 1,
          description: item.description,
          unit_of_issue: item.unitOfIssue,
          quantity_ordered: item.quantityOrdered,
          quantity_approved: item.quantityApproved || 0,
          quantity_issued: item.quantityIssued || 0,
          quantity_received: item.quantityReceived || 0
        }, { transaction: t });
      }
    }

    // Create signature placeholders
    const signatureRoles = [
      'requisition_officer',
      'approving_officer', 
      'issuing_officer',
      'receiving_officer',
      'head_of_department'
    ];

    for (const role of signatureRoles) {
      await RequisitionSignature.create({
        requisition_id: requisition.requisition_id,
        role: role
      }, { transaction: t });
    }

    await t.commit();
    
    res.status(201).json({
      success: true,
      message: 'Form 76A requisition created successfully',
      data: {
        requisition_id: requisition.requisition_id,
        serial_no: requisition.serial_no
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating Form 76A:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Form 76A requisition',
      error: error.message
    });
  }
});

// Get all Form 76A requisitions
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
        { serial_no: { [Op.like]: `%${search}%` } },
        { from_department: { [Op.like]: `%${search}%` } },
        { to_store: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: requisitions } = await Requisition.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: RequisitionItem,
          as: 'items',
          attributes: ['req_item_id', 'serial_no', 'description', 'quantity_ordered', 'quantity_approved', 'quantity_issued']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        requisitions,
        pagination: {
          current: page,
          pageSize: limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching Form 76A requisitions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requisitions',
      error: error.message
    });
  }
});

// Get single Form 76A requisition by ID
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
          as: 'signatures',
          order: [['role', 'ASC']]
        }
      ]
    });

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: 'Form 76A requisition not found'
      });
    }

    res.json({
      success: true,
      data: requisition
    });
  } catch (error) {
    console.error('Error fetching Form 76A requisition:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch requisition',
      error: error.message
    });
  }
});

// Update Form 76A requisition
router.put('/:id', async (req, res) => {
  const t = await Requisition.sequelize.transaction();
  try {
    const { 
      formDate, 
      fromDepartment, 
      toStore, 
      purposeRemarks, 
      items,
      status 
    } = req.body;

    const requisition = await Requisition.findByPk(req.params.id);
    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: 'Form 76A requisition not found'
      });
    }

    // Update requisition
    await requisition.update({
      form_date: formDate,
      from_department: fromDepartment,
      to_store: toStore,
      purpose_remarks: purposeRemarks,
      status: status || requisition.status
    }, { transaction: t });

    // Update items if provided
    if (Array.isArray(items)) {
      // Delete existing items
      await RequisitionItem.destroy({
        where: { requisition_id: requisition.requisition_id },
        transaction: t
      });

      // Create new items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await RequisitionItem.create({
          requisition_id: requisition.requisition_id,
          serial_no: i + 1,
          description: item.description,
          unit_of_issue: item.unitOfIssue,
          quantity_ordered: item.quantityOrdered,
          quantity_approved: item.quantityApproved || 0,
          quantity_issued: item.quantityIssued || 0,
          quantity_received: item.quantityReceived || 0
        }, { transaction: t });
      }
    }

    await t.commit();
    
    res.json({
      success: true,
      message: 'Form 76A requisition updated successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error updating Form 76A:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Form 76A requisition',
      error: error.message
    });
  }
});

// Update requisition status (Draft → Submitted → Printed)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['draft', 'submitted', 'printed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: draft, submitted, printed'
      });
    }

    const requisition = await Requisition.findByPk(req.params.id);
    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: 'Form 76A requisition not found'
      });
    }

    const updateData = { status };
    if (status === 'printed') {
      updateData.printed_at = new Date();
    }

    await requisition.update(updateData);

    res.json({
      success: true,
      message: `Form 76A requisition status updated to ${status}`,
      data: { status: requisition.status }
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
});

// Generate PDF for Form 76A
router.get('/:id/pdf', async (req, res) => {
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
          as: 'signatures',
          order: [['role', 'ASC']]
        }
      ]
    });

    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: 'Form 76A requisition not found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument({ 
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Form76A-${requisition.serial_no}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('MINISTRY OF HEALTH', { align: 'center' });
    doc.fontSize(14).text('STORES REQUISITION / ISSUE VOUCHER (Form 76A)', { align: 'center' });
    doc.moveDown(1);

    // Form details
    doc.fontSize(10).font('Helvetica');
    doc.text(`Serial No: ${requisition.serial_no}`, 50, doc.y);
    doc.text(`Date: ${new Date(requisition.form_date).toLocaleDateString()}`, 300, doc.y);
    doc.moveDown(0.5);
    
    doc.text(`From Department/Unit: ${requisition.from_department}`, 50, doc.y);
    doc.moveDown(0.5);
    
    doc.text(`To (Store/Receiving Section): ${requisition.to_store}`, 50, doc.y);
    doc.moveDown(0.5);
    
    doc.text(`Purpose / Remarks:`, 50, doc.y);
    doc.text(requisition.purpose_remarks, 50, doc.y + 15, { width: 500 });
    doc.moveDown(2);

    // Items table header
    const tableTop = doc.y;
    const colWidths = [50, 200, 80, 80, 80, 80, 80];
    const colPositions = [50];
    
    for (let i = 1; i < colWidths.length; i++) {
      colPositions.push(colPositions[i-1] + colWidths[i-1]);
    }

    // Table headers
    doc.font('Helvetica-Bold').fontSize(9);
    const headers = ['Serial No', 'Description', 'Unit of Issue', 'Qty Ordered', 'Qty Approved', 'Qty Issued', 'Qty Received'];
    
    headers.forEach((header, i) => {
      doc.text(header, colPositions[i], tableTop, { width: colWidths[i], align: 'center' });
    });

    // Draw table lines
    doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();
    
    // Table rows
    doc.font('Helvetica').fontSize(9);
    let currentY = tableTop + 25;
    
    requisition.items.forEach((item, index) => {
      const rowData = [
        item.serial_no.toString(),
        item.description,
        item.unit_of_issue,
        item.quantity_ordered.toString(),
        item.quantity_approved.toString(),
        item.quantity_issued.toString(),
        item.quantity_received.toString()
      ];

      rowData.forEach((data, i) => {
        doc.text(data, colPositions[i], currentY, { width: colWidths[i], align: 'center' });
      });

      currentY += 20;
      
      // Draw horizontal line
      doc.moveTo(50, currentY - 5).lineTo(550, currentY - 5).stroke();
    });

    doc.moveDown(2);

    // Signature section
    doc.font('Helvetica-Bold').fontSize(10).text('SIGNATURES', { align: 'center' });
    doc.moveDown(1);

    const signatureRoles = [
      'Requisition Officer',
      'Approving Officer', 
      'Issuing Officer',
      'Receiving Officer',
      'Head of Department/Unit'
    ];

    doc.font('Helvetica').fontSize(9);
    signatureRoles.forEach((role, index) => {
      const sigY = doc.y;
      doc.text(`${role}`, 50, sigY);
      doc.text('Name: ___________________________', 200, sigY);
      doc.text('Signature: _____________________', 200, sigY + 15);
      doc.text('Date: ___________', 200, sigY + 30);
      doc.moveDown(1.5);
    });

    // Footer
    doc.fontSize(8).text('This form must be completed and signed before items are issued.', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF',
      error: error.message
    });
  }
});

// Delete Form 76A requisition
router.delete('/:id', async (req, res) => {
  const t = await Requisition.sequelize.transaction();
  try {
    const requisition = await Requisition.findByPk(req.params.id);
    if (!requisition) {
      return res.status(404).json({
        success: false,
        message: 'Form 76A requisition not found'
      });
    }

    // Delete related records
    await RequisitionItem.destroy({
      where: { requisition_id: requisition.requisition_id },
      transaction: t
    });

    await RequisitionSignature.destroy({
      where: { requisition_id: requisition.requisition_id },
      transaction: t
    });

    await requisition.destroy({ transaction: t });

    await t.commit();
    
    res.json({
      success: true,
      message: 'Form 76A requisition deleted successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting Form 76A:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Form 76A requisition',
      error: error.message
    });
  }
});

module.exports = router;
