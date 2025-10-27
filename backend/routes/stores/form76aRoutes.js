const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const moment = require('moment');

const Requisition = require('../../models/stores/requisitionModel');
const RequisitionItem = require('../../models/stores/requisitionItemModel');
const RequisitionSignature = require('../../models/stores/requisitionSignatureModel');
const User = require('../../models/users/userModel');
const emailService = require('../../services/emailService');

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

    const where = {};
    if (status) where.status = status;
    if (department_id) where.department_id = department_id;
    if (created_by) where.created_by = created_by;
    if (search) {
      where[Op.or] = [
        { requisition_number: { [Op.like]: `%${search}%` } },
        { from_department: { [Op.like]: `%${search}%` } },
        { purpose_remarks: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Requisition.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstname', 'lastname', 'health_email', 'designation']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        requisitions: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching requisitions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/stores/form76a/:id - Get single requisition with items and signatures
router.get('/:id', async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id, {
      include: [
        {
          model: RequisitionItem,
          as: 'items'
        },
        {
          model: RequisitionSignature,
          as: 'signatures'
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstname', 'lastname', 'health_email', 'designation']
        }
      ]
    });

    if (!requisition) {
      return res.status(404).json({ success: false, message: 'Requisition not found' });
    }

    res.json({ success: true, data: requisition });
  } catch (error) {
    console.error('Error fetching requisition:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/stores/form76a - Create new requisition
router.post('/', async (req, res) => {
  const transaction = await Requisition.sequelize.transaction();
  
  try {
    const {
      department,
      destination,
      purpose,
      items,
      approving_officer_id,
      issuing_officer_id,
      head_of_department_id
    } = req.body;

    // Generate unique requisition number
    const count = await Requisition.count();
    const serialNo = String(count + 1).padStart(6, '0');
    const requisitionNumber = `MOH-REQ-${serialNo}`;

    const requisition = await Requisition.create({
      serial_no: serialNo,
      requisition_number: requisitionNumber,
      form_date: new Date(),
      from_department: department,
      to_store: destination,
      purpose_remarks: purpose,
      department_id: req.body.department_id || null,
      created_by: (req.user && req.user.id) || 1,
      approving_officer_id,
      issuing_officer_id,
      head_of_department_id,
      status: 'pending'
    }, { transaction });

    // Create requisition items
    if (items && Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        await RequisitionItem.create({
          requisition_id: requisition.requisition_id,
          serial_no: i + 1,
          description: items[i].description,
          unit_of_issue: items[i].unit_of_issue,
          quantity_ordered: items[i].quantity_ordered,
          quantity_approved: items[i].quantity_approved || 0,
          quantity_issued: items[i].quantity_issued || 0,
          quantity_received: items[i].quantity_received || 0
        }, { transaction });
      }
    }

    // Create signature placeholders
    const signatures = [
      { role: 'requisition_officer', name: null, signature: null, signed_at: null },
      { role: 'approving_officer', name: null, signature: null, signed_at: null },
      { role: 'issuing_officer', name: null, signature: null, signed_at: null },
      { role: 'receiving_officer', name: null, signature: null, signed_at: null },
      { role: 'head_of_department', name: null, signature: null, signed_at: null }
    ];

    for (const sig of signatures) {
      await RequisitionSignature.create({
        requisition_id: requisition.requisition_id,
        ...sig
      }, { transaction });
    }

    await transaction.commit();

    // Send notification emails (async)
    try {
      const signatories = await User.findAll({
        where: {
          id: [approving_officer_id, issuing_officer_id, head_of_department_id].filter(Boolean)
        },
        attributes: ['id', 'firstname', 'lastname', 'health_email']
      });

      const user = await User.findByPk(req.user?.id || 1);
      
      emailService.sendRequisitionSubmitted(requisition, user, signatories);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Requisition created successfully',
      data: requisition
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating requisition:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/stores/form76a/:id/status - Update requisition status (Approval, Issuance, Closure)
router.patch('/:id/status', async (req, res) => {
  const transaction = await Requisition.sequelize.transaction();
  
  try {
    const { status, remarks } = req.body;
    const requisition = await Requisition.findByPk(req.params.id);

    if (!requisition) {
      return res.status(404).json({ success: false, message: 'Requisition not found' });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['approved', 'rejected'],
      'approved': ['issued', 'partially_issued'],
      'issued': ['closed'],
      'partially_issued': ['closed']
    };

    if (!validTransitions[requisition.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${requisition.status} to ${status}`
      });
    }

    // Update status and timestamp
    const updateData = { status };
    
    if (status === 'approved') {
      updateData.approved_at = new Date();
      updateData.approving_officer_id = req.user?.id;
    } else if (status === 'issued' || status === 'partially_issued') {
      updateData.issued_at = new Date();
      updateData.issuing_officer_id = req.user?.id;
    } else if (status === 'closed') {
      updateData.closed_at = new Date();
      updateData.head_of_department_id = req.user?.id;
    }

    if (remarks) {
      if (status === 'rejected') {
        updateData.rejection_reason = remarks;
      }
    }

    await requisition.update(updateData, { transaction });
    await transaction.commit();

    // Send status change notifications
    const user = await User.findByPk(req.user?.id);
    
    if (status === 'approved') {
      emailService.sendRequisitionApproved(requisition, user);
    } else if (status === 'issued') {
      emailService.sendRequisitionIssued(requisition, user);
    } else if (status === 'closed') {
      emailService.sendRequisitionClosed(requisition, user);
    }

    res.json({
      success: true,
      message: `Requisition ${status} successfully`,
      data: requisition
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error updating requisition status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/stores/form76a/:id/pdf - Generate MOH Form 76A PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const requisition = await Requisition.findByPk(req.params.id, {
      include: [
        { model: RequisitionItem, as: 'items' },
        { model: RequisitionSignature, as: 'signatures' }
      ]
    });

    if (!requisition) {
      return res.status(404).json({ success: false, message: 'Requisition not found' });
    }

    // Create PDF
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Form76A-${requisition.requisition_number}.pdf"`);

    doc.pipe(res);

    // Ministry Header
    doc.fontSize(16).font('Helvetica-Bold').text('MINISTRY OF HEALTH', { align: 'center' });
    doc.fontSize(14).font('Helvetica-Bold').text('STORES REQUISITION / ISSUE VOUCHER', { align: 'center' });
    doc.fontSize(12).font('Helvetica-Bold').text('(Form 76A)', { align: 'center' });
    
    doc.moveDown();

    // Form Details
    doc.fontSize(10).font('Helvetica').text(`Serial No.: ${requisition.serial_no}`);
    doc.text(`Requisition Number: ${requisition.requisition_number}`);
    doc.text(`Date: ${moment(requisition.form_date).format('DD/MM/YYYY')}`);
    
    doc.moveDown();
    
    doc.text(`From Department/Unit: ${requisition.from_department}`);
    doc.text(`To (Store/Receiving Section): ${requisition.to_store}`);
    doc.text(`Purpose / Remarks: ${requisition.purpose_remarks}`);
    
    doc.moveDown();

    // Items Table
    const tableTop = doc.y;
    const tableWidth = 500;
    const colWidth = 100;
    
    // Table Header
    doc.font('Helvetica-Bold').fontSize(8);
    doc.text('S/N', 50, tableTop);
    doc.text('Description', 90, tableTop);
    doc.text('Unit', 200, tableTop);
    doc.text('Qty Ordered', 240, tableTop);
    doc.text('Qty Approved', 300, tableTop);
    doc.text('Qty Issued', 370, tableTop);
    doc.text('Qty Received', 430, tableTop);

    // Table rows
    doc.font('Helvetica').fontSize(8);
    requisition.items.forEach((item, index) => {
      const yPos = tableTop + 20 + (index * 30);
      doc.text(item.serial_no || index + 1, 50, yPos);
      doc.text(item.description, 90, yPos);
      doc.text(item.unit_of_issue, 200, yPos);
      doc.text(item.quantity_ordered?.toString() || '0', 240, yPos);
      doc.text(item.quantity_approved?.toString() || '0', 300, yPos);
      doc.text(item.quantity_issued?.toString() || '0', 370, yPos);
      doc.text(item.quantity_received?.toString() || '0', 430, yPos);
    });

    doc.moveDown(3);

    // Signature Placeholders
    doc.fontSize(10).font('Helvetica-Bold').text('SIGNATURES (To be filled physically after printing)', { align: 'left' });
    
    doc.moveDown();

    const signatures = [
      { role: 'Requisition Officer', position: 1 },
      { role: 'Approving Officer', position: 2 },
      { role: 'Issuing Officer', position: 3 },
      { role: 'Receiving Officer', position: 4 },
      { role: 'Head of Department/Unit', position: 5 }
    ];

    signatures.forEach((sig, index) => {
      doc.font('Helvetica').fontSize(9);
      doc.text(`${sig.role}:`, 50, doc.y);
      doc.text(`Name: ___________________________`);
      doc.text(`Signature: _____________________`);
      doc.text(`Date: ___________`);
      doc.moveDown(0.5);
    });

    // Footer
    doc.fontSize(8).font('Helvetica');
    doc.text('This form must be completed and signed before items are issued from the stores.', 50, doc.y);
    
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;