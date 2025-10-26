const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

const GRN = require('../../models/stores/grnModel');
const GRNItem = require('../../models/stores/grnItemModel');
const GRNAttachment = require('../../models/stores/grnAttachmentModel');
const GRNSignature = require('../../models/stores/grnSignatureModel');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../uploads/grn');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xlsx|xls|png|jpg|jpeg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, XLSX, XLS, PNG, JPG, JPEG files are allowed'));
    }
  }
});

// Generate unique GRN number
const generateGRNNumber = async () => {
  const count = await GRN.count();
  const paddedCount = String(count + 1).padStart(6, '0');
  return `GRN-${paddedCount}`;
};

// POST /api/grn - Create new GRN record
router.post('/', upload.array('attachments', 10), async (req, res) => {
  const transaction = await GRN.sequelize.transaction();
  
  try {
    const grnNumber = await generateGRNNumber();
    
    const grnData = {
      grn_number: grnNumber,
      date_received: req.body.date_received || new Date(),
      delivery_note_no: req.body.delivery_note_no,
      tax_invoice_no: req.body.tax_invoice_no,
      lpo_no: req.body.lpo_no,
      contract_no: req.body.contract_no,
      supplier_name: req.body.supplier_name,
      supplier_contact: req.body.supplier_contact,
      delivery_location: req.body.delivery_location,
      remarks: req.body.remarks,
      created_by: req.user?.id || 1
    };

    const grn = await GRN.create(grnData, { transaction });

    // Create GRN items
    if (req.body.items && Array.isArray(req.body.items)) {
      const items = JSON.parse(req.body.items);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const totalValue = item.unit_price && item.quantity_accepted ? 
          parseFloat(item.unit_price) * parseInt(item.quantity_accepted) : 0;
        
        await GRNItem.create({
          grn_id: grn.grn_id,
          serial_no: i + 1,
          description: item.description,
          unit_of_measure: item.unit_of_measure,
          quantity_ordered: item.quantity_ordered,
          quantity_delivered: item.quantity_delivered,
          quantity_accepted: item.quantity_accepted,
          unit_price: item.unit_price,
          total_value: totalValue,
          remarks: item.remarks
        }, { transaction });
      }
    }

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await GRNAttachment.create({
          grn_id: grn.grn_id,
          document_type: req.body.document_types ? 
            JSON.parse(req.body.document_types)[req.files.indexOf(file)] : 'other',
          file_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype,
          uploaded_by: req.user?.id || 1
        }, { transaction });
      }
    }

    // Create signature placeholders
    const signatureRoles = ['receiving_officer', 'inspection_officer', 'head_of_stores', 'accounts_officer', 'head_of_department'];
    for (const role of signatureRoles) {
      await GRNSignature.create({
        grn_id: grn.grn_id,
        role: role
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'GRN created successfully',
      data: grn
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error creating GRN:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating GRN',
      error: error.message
    });
  }
});

// Get all GRNs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, supplier, date_from, date_to } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (supplier) whereClause.supplier_name = { [Op.iLike]: `%${supplier}%` };
    if (date_from || date_to) {
      whereClause.date_received = {};
      if (date_from) whereClause.date_received[Op.gte] = new Date(date_from);
      if (date_to) whereClause.date_received[Op.lte] = new Date(date_to);
    }

    const { count, rows } = await GRN.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: GRNItem,
          as: 'items'
        },
        {
          model: GRNAttachment,
          as: 'attachments'
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
    console.error('Error fetching GRNs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching GRNs',
      error: error.message
    });
  }
});

// Get single GRN
router.get('/:id', async (req, res) => {
  try {
    const grn = await GRN.findByPk(req.params.id, {
      include: [
        {
          model: GRNItem,
          as: 'items',
          order: [['serial_no', 'ASC']]
        },
        {
          model: GRNAttachment,
          as: 'attachments'
        },
        {
          model: GRNSignature,
          as: 'signatures'
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
      message: 'Error fetching GRN',
      error: error.message
    });
  }
});

// Update GRN
router.put('/:id', upload.array('attachments', 10), async (req, res) => {
  const transaction = await GRN.sequelize.transaction();
  
  try {
    const grn = await GRN.findByPk(req.params.id);
    if (!grn) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    const updateData = {
      date_received: req.body.date_received,
      delivery_note_no: req.body.delivery_note_no,
      tax_invoice_no: req.body.tax_invoice_no,
      lpo_no: req.body.lpo_no,
      contract_no: req.body.contract_no,
      supplier_name: req.body.supplier_name,
      supplier_contact: req.body.supplier_contact,
      delivery_location: req.body.delivery_location,
      remarks: req.body.remarks
    };

    await grn.update(updateData, { transaction });

    // Update items if provided
    if (req.body.items) {
      // Delete existing items
      await GRNItem.destroy({ where: { grn_id: grn.grn_id }, transaction });
      
      // Create new items
      const items = JSON.parse(req.body.items);
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const totalValue = item.unit_price && item.quantity_accepted ? 
          parseFloat(item.unit_price) * parseInt(item.quantity_accepted) : 0;
        
        await GRNItem.create({
          grn_id: grn.grn_id,
          serial_no: i + 1,
          description: item.description,
          unit_of_measure: item.unit_of_measure,
          quantity_ordered: item.quantity_ordered,
          quantity_delivered: item.quantity_delivered,
          quantity_accepted: item.quantity_accepted,
          unit_price: item.unit_price,
          total_value: totalValue,
          remarks: item.remarks
        }, { transaction });
      }
    }

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await GRNAttachment.create({
          grn_id: grn.grn_id,
          document_type: req.body.document_types ? 
            JSON.parse(req.body.document_types)[req.files.indexOf(file)] : 'other',
          file_name: file.originalname,
          file_path: file.path,
          file_size: file.size,
          mime_type: file.mimetype,
          uploaded_by: req.user?.id || 1
        }, { transaction });
      }
    }

    await transaction.commit();

    res.json({
      success: true,
      message: 'GRN updated successfully',
      data: grn
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error updating GRN:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating GRN',
      error: error.message
    });
  }
});

// Update GRN status
router.patch('/:id/status', async (req, res) => {
  try {
    const grn = await GRN.findByPk(req.params.id);
    if (!grn) {
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    const updateData = {
      status: req.body.status
    };

    if (req.body.status === 'approved') {
      updateData.approved_by = req.user?.id || 1;
      updateData.approved_at = new Date();
    }

    await grn.update(updateData);

    res.json({
      success: true,
      message: 'GRN status updated successfully',
      data: grn
    });

  } catch (error) {
    console.error('Error updating GRN status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating GRN status',
      error: error.message
    });
  }
});

// Delete GRN
router.delete('/:id', async (req, res) => {
  const transaction = await GRN.sequelize.transaction();
  
  try {
    const grn = await GRN.findByPk(req.params.id);
    if (!grn) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    // Delete related records
    await GRNItem.destroy({ where: { grn_id: grn.grn_id }, transaction });
    await GRNAttachment.destroy({ where: { grn_id: grn.grn_id }, transaction });
    await GRNSignature.destroy({ where: { grn_id: grn.grn_id }, transaction });
    
    // Delete GRN
    await grn.destroy({ transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'GRN deleted successfully'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting GRN:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting GRN',
      error: error.message
    });
  }
});

// POST /api/grn/:id/items - Add item(s) to GRN
router.post('/:id/items', async (req, res) => {
  try {
    const grn = await GRN.findByPk(req.params.id);
    if (!grn) {
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    const items = Array.isArray(req.body) ? req.body : [req.body];
    const createdItems = [];

    for (const item of items) {
      const totalValue = item.unit_price && item.qty_accepted ? 
        parseFloat(item.unit_price) * parseFloat(item.qty_accepted) : 0;
      
      const createdItem = await GRNItem.create({
        grn_id: grn.grn_id,
        serial_no: item.serial_no,
        description: item.description,
        unit_of_measure: item.unit_of_measure,
        qty_ordered: item.qty_ordered,
        qty_delivered: item.qty_delivered,
        qty_accepted: item.qty_accepted,
        unit_price: item.unit_price,
        total_value: totalValue,
        remarks: item.remarks
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

// DELETE /api/grn/items/:item_id - Delete specific item
router.delete('/items/:item_id', async (req, res) => {
  try {
    const item = await GRNItem.findByPk(req.params.item_id);
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

// POST /api/grn/:id/attachments - Upload Form 5/spec files
router.post('/:id/attachments', upload.array('attachments', 10), async (req, res) => {
  try {
    const grn = await GRN.findByPk(req.params.id);
    if (!grn) {
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      const attachment = await GRNAttachment.create({
        grn_id: grn.grn_id,
        document_type: req.body.document_types ? 
          JSON.parse(req.body.document_types)[req.files.indexOf(file)] : 'other',
        file_name: file.originalname,
        file_path: file.path,
        file_size: file.size,
        mime_type: file.mimetype,
        uploaded_by: req.user?.id || 1
      });
      uploadedFiles.push(attachment);
    }

    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading files',
      error: error.message
    });
  }
});

// GET /api/grn/print/:id - Generate printable PDF GRN
router.get('/print/:id', async (req, res) => {
  try {
    const grn = await GRN.findByPk(req.params.id, {
      include: [
        {
          model: GRNItem,
          as: 'items',
          order: [['serial_no', 'ASC']]
        },
        {
          model: GRNAttachment,
          as: 'attachments'
        },
        {
          model: GRNSignature,
          as: 'signatures'
        }
      ]
    });

    if (!grn) {
      return res.status(404).json({
        success: false,
        message: 'GRN not found'
      });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="GRN-${grn.grn_number}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('MINISTRY OF HEALTH', 50, 50, { align: 'center' });
    doc.fontSize(14).text('GOODS RECEIVED NOTE (GRN)', 50, 70, { align: 'center' });
    
    // GRN Details
    doc.fontSize(10).font('Helvetica');
    let yPosition = 120;
    
    doc.text(`GRN No.: ${grn.grn_number}`, 50, yPosition);
    doc.text(`Date Received: ${new Date(grn.date_received).toLocaleDateString()}`, 300, yPosition);
    yPosition += 20;
    
    doc.text(`Delivery Note No.: ${grn.delivery_note_no || 'N/A'}`, 50, yPosition);
    doc.text(`Tax Invoice No.: ${grn.tax_invoice_no || 'N/A'}`, 300, yPosition);
    yPosition += 20;
    
    doc.text(`LPO No.: ${grn.lpo_no || 'N/A'}`, 50, yPosition);
    doc.text(`Contract No.: ${grn.contract_no || 'N/A'}`, 300, yPosition);
    yPosition += 20;
    
    doc.text(`Supplier: ${grn.supplier_name}`, 50, yPosition);
    doc.text(`Contact: ${grn.supplier_contact || 'N/A'}`, 300, yPosition);
    yPosition += 20;
    
    doc.text(`Delivery Location: ${grn.delivery_location}`, 50, yPosition);
    yPosition += 30;

    // Items Table Header
    doc.font('Helvetica-Bold');
    doc.text('Serial No.', 50, yPosition);
    doc.text('Description', 100, yPosition);
    doc.text('Unit', 300, yPosition);
    doc.text('Qty Ordered', 350, yPosition);
    doc.text('Qty Delivered', 420, yPosition);
    doc.text('Qty Accepted', 490, yPosition);
    doc.text('Unit Price', 560, yPosition);
    yPosition += 20;

    // Items Table Content
    doc.font('Helvetica');
    grn.items.forEach(item => {
      doc.text(item.serial_no.toString(), 50, yPosition);
      doc.text(item.description, 100, yPosition, { width: 190 });
      doc.text(item.unit_of_measure, 300, yPosition);
      doc.text(item.quantity_ordered.toString(), 350, yPosition);
      doc.text(item.quantity_delivered.toString(), 420, yPosition);
      doc.text(item.quantity_accepted.toString(), 490, yPosition);
      doc.text(item.unit_price ? item.unit_price.toString() : 'N/A', 560, yPosition);
      yPosition += 20;
    });

    yPosition += 30;

    // Signatures Section
    doc.font('Helvetica-Bold').text('SIGNATURES', 50, yPosition);
    yPosition += 30;

    const signatureRoles = [
      'Receiving Officer',
      'Inspection Officer', 
      'Head of Stores / Procurement',
      'Accounts Officer',
      'Head of Department / Unit'
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
    console.error('Error generating GRN PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating GRN PDF',
      error: error.message
    });
  }
});

module.exports = router;