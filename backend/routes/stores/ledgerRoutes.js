const express = require('express');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const Ledger = require('../../models/stores/ledgerModel');
const LedgerTransaction = require('../../models/stores/ledgerTransactionModel');

const router = express.Router();

// Helper function to log transactions
const logTransaction = async (ledgerId, operationType, userId, details = null, req = null) => {
  try {
    await LedgerTransaction.create({
      ledger_id: ledgerId,
      operation_type: operationType,
      user_id: userId,
      operation_details: details ? JSON.stringify(details) : null,
      ip_address: (req && req.ip) || (req && req.connection && req.connection.remoteAddress),
      user_agent: (req && req.get) ? req.get('User-Agent') : null
    });
  } catch (error) {
    console.error('Error logging transaction:', error);
  }
};

// Get ledger entries with filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      item_code, 
      department, 
      date_from, 
      date_to, 
      reference_type,
      sort_by = 'transaction_date',
      sort_order = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (item_code) whereClause.item_code = { [Op.iLike]: `%${item_code}%` };
    if (department) whereClause.department = { [Op.iLike]: `%${department}%` };
    if (reference_type) whereClause.reference_type = reference_type;
    if (date_from || date_to) {
      whereClause.transaction_date = {};
      if (date_from) whereClause.transaction_date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.transaction_date[Op.lte] = new Date(date_to);
    }

    const { count, rows } = await Ledger.findAndCountAll({
      where: whereClause,
      order: [[sort_by, sort_order.toUpperCase()]],
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
    console.error('Error fetching ledger entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ledger entries',
      error: error.message
    });
  }
});

// Get ledger for specific item
router.get('/item/:itemCode', async (req, res) => {
  try {
    const { itemCode } = req.params;
    const { date_from, date_to } = req.query;

    const whereClause = { item_code: itemCode };
    if (date_from || date_to) {
      whereClause.transaction_date = {};
      if (date_from) whereClause.transaction_date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.transaction_date[Op.lte] = new Date(date_to);
    }

    const entries = await Ledger.findAll({
      where: whereClause,
      order: [['transaction_date', 'ASC']]
    });

    res.json({
      success: true,
      data: entries
    });

  } catch (error) {
    console.error('Error fetching item ledger:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching item ledger',
      error: error.message
    });
  }
});

// Get current stock balances
router.get('/balance', async (req, res) => {
  try {
    const { department, item_code } = req.query;

    const whereClause = {};
    if (department) whereClause.department = { [Op.iLike]: `%${department}%` };
    if (item_code) whereClause.item_code = { [Op.iLike]: `%${item_code}%` };

    // Get latest balance for each item
    const balances = await Ledger.findAll({
      where: whereClause,
      order: [['item_code', 'ASC'], ['transaction_date', 'DESC']],
      group: ['item_code'],
      attributes: [
        'item_code',
        'item_description',
        'unit_of_issue',
        'balance_on_hand',
        'unit_cost',
        'total_value',
        'department'
      ]
    });

    res.json({
      success: true,
      data: balances
    });

  } catch (error) {
    console.error('Error fetching stock balances:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock balances',
      error: error.message
    });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const { threshold = 10, department } = req.query;

    const whereClause = {
      balance_on_hand: { [Op.lte]: parseInt(threshold) }
    };
    if (department) whereClause.department = { [Op.iLike]: `%${department}%` };

    const lowStockItems = await Ledger.findAll({
      where: whereClause,
      order: [['balance_on_hand', 'ASC']],
      group: ['item_code'],
      attributes: [
        'item_code',
        'item_description',
        'unit_of_issue',
        'balance_on_hand',
        'unit_cost',
        'department'
      ]
    });

    res.json({
      success: true,
      data: lowStockItems
    });

  } catch (error) {
    console.error('Error fetching low stock items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching low stock items',
      error: error.message
    });
  }
});

// Create manual ledger entry (for adjustments)
router.post('/', async (req, res) => {
  try {
    const {
      transaction_date,
      reference_type,
      reference_number,
      item_description,
      item_code,
      unit_of_issue,
      quantity_received,
      quantity_issued,
      unit_cost,
      department,
      remarks
    } = req.body;

    // Calculate balance - get last balance for this item
    const lastEntry = await Ledger.findOne({
      where: { item_code: item_code },
      order: [['transaction_date', 'DESC']]
    });

    const lastBalance = lastEntry ? lastEntry.balance_on_hand : 0;
    const newBalance = lastBalance + (quantity_received || 0) - (quantity_issued || 0);
    
    if (newBalance < 0) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock balance for this transaction'
      });
    }

    const totalValue = unit_cost && newBalance ? parseFloat(unit_cost) * newBalance : null;

    const ledgerEntry = await Ledger.create({
      transaction_date: transaction_date || new Date(),
      reference_type: reference_type || 'adjustment',
      reference_number: reference_number || `ADJ-${Date.now()}`,
      item_description,
      item_code,
      unit_of_issue,
      quantity_received: quantity_received || 0,
      quantity_issued: quantity_issued || 0,
      balance_on_hand: newBalance,
      unit_cost,
      total_value: totalValue,
      department,
      remarks,
      created_by: (req.user && req.user.id) || 1,
      is_manual_entry: true
    });

    // Log the transaction
    await logTransaction(ledgerEntry.ledger_id, 'create', (req.user && req.user.id) || 1, req.body, req);

    res.status(201).json({
      success: true,
      message: 'Ledger entry created successfully',
      data: ledgerEntry
    });

  } catch (error) {
    console.error('Error creating ledger entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ledger entry',
      error: error.message
    });
  }
});

// Get movement summary
router.get('/movement/summary', async (req, res) => {
  try {
    const { date_from, date_to, department } = req.query;

    const whereClause = {};
    if (date_from || date_to) {
      whereClause.transaction_date = {};
      if (date_from) whereClause.transaction_date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.transaction_date[Op.lte] = new Date(date_to);
    }
    if (department) whereClause.department = { [Op.iLike]: `%${department}%` };

    const summary = await Ledger.findAll({
      where: whereClause,
      attributes: [
        'reference_type',
        [sequelize.fn('SUM', sequelize.col('quantity_received')), 'total_received'],
        [sequelize.fn('SUM', sequelize.col('quantity_issued')), 'total_issued'],
        [sequelize.fn('COUNT', sequelize.col('ledger_id')), 'transaction_count']
      ],
      group: ['reference_type']
    });

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Error fetching movement summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching movement summary',
      error: error.message
    });
  }
});

// Export ledger to PDF
router.get('/export/pdf', async (req, res) => {
  try {
    const { date_from, date_to, department, item_code } = req.query;

    const whereClause = {};
    if (date_from || date_to) {
      whereClause.transaction_date = {};
      if (date_from) whereClause.transaction_date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.transaction_date[Op.lte] = new Date(date_to);
    }
    if (department) whereClause.department = { [Op.iLike]: `%${department}%` };
    if (item_code) whereClause.item_code = { [Op.iLike]: `%${item_code}%` };

    const entries = await Ledger.findAll({
      where: whereClause,
      order: [['transaction_date', 'DESC']]
    });

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="stores-ledger.pdf"');
    
    doc.pipe(res);

    // Header
    doc.fontSize(16).font('Helvetica-Bold').text('MINISTRY OF HEALTH', 50, 50, { align: 'center' });
    doc.fontSize(14).text('STORES LEDGER REPORT', 50, 70, { align: 'center' });
    
    // Report details
    doc.fontSize(10).font('Helvetica');
    let yPosition = 120;
    
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 50, yPosition);
    if (date_from) doc.text(`From: ${new Date(date_from).toLocaleDateString()}`, 300, yPosition);
    if (date_to) doc.text(`To: ${new Date(date_to).toLocaleDateString()}`, 450, yPosition);
    yPosition += 30;

    // Table Header
    doc.font('Helvetica-Bold');
    doc.text('Date', 50, yPosition);
    doc.text('Ref Type', 120, yPosition);
    doc.text('Ref No.', 180, yPosition);
    doc.text('Item Description', 250, yPosition);
    doc.text('Qty In', 400, yPosition);
    doc.text('Qty Out', 450, yPosition);
    doc.text('Balance', 500, yPosition);
    yPosition += 20;

    // Table Content
    doc.font('Helvetica');
    entries.forEach(entry => {
      doc.text(new Date(entry.transaction_date).toLocaleDateString(), 50, yPosition);
      doc.text(entry.reference_type, 120, yPosition);
      doc.text(entry.reference_number, 180, yPosition);
      doc.text(entry.item_description, 250, yPosition, { width: 140 });
      doc.text(entry.quantity_received.toString(), 400, yPosition);
      doc.text(entry.quantity_issued.toString(), 450, yPosition);
      doc.text(entry.balance_on_hand.toString(), 500, yPosition);
      yPosition += 20;
    });

    doc.end();

  } catch (error) {
    console.error('Error exporting ledger PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting ledger PDF',
      error: error.message
    });
  }
});

// Export ledger to Excel
router.get('/export/excel', async (req, res) => {
  try {
    const { date_from, date_to, department, item_code } = req.query;

    const whereClause = {};
    if (date_from || date_to) {
      whereClause.transaction_date = {};
      if (date_from) whereClause.transaction_date[Op.gte] = new Date(date_from);
      if (date_to) whereClause.transaction_date[Op.lte] = new Date(date_to);
    }
    if (department) whereClause.department = { [Op.iLike]: `%${department}%` };
    if (item_code) whereClause.item_code = { [Op.iLike]: `%${item_code}%` };

    const entries = await Ledger.findAll({
      where: whereClause,
      order: [['transaction_date', 'DESC']]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Stores Ledger');

    // Add headers
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Ref Type', key: 'refType', width: 12 },
      { header: 'Ref Number', key: 'refNumber', width: 15 },
      { header: 'Item Description', key: 'description', width: 30 },
      { header: 'Item Code', key: 'itemCode', width: 15 },
      { header: 'Unit', key: 'unit', width: 10 },
      { header: 'Qty Received', key: 'qtyReceived', width: 12 },
      { header: 'Qty Issued', key: 'qtyIssued', width: 12 },
      { header: 'Balance', key: 'balance', width: 12 },
      { header: 'Unit Cost', key: 'unitCost', width: 12 },
      { header: 'Total Value', key: 'totalValue', width: 15 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Remarks', key: 'remarks', width: 25 }
    ];

    // Add data
    entries.forEach(entry => {
      worksheet.addRow({
        date: new Date(entry.transaction_date).toLocaleDateString(),
        refType: entry.reference_type,
        refNumber: entry.reference_number,
        description: entry.item_description,
        itemCode: entry.item_code,
        unit: entry.unit_of_issue,
        qtyReceived: entry.quantity_received,
        qtyIssued: entry.quantity_issued,
        balance: entry.balance_on_hand,
        unitCost: entry.unit_cost,
        totalValue: entry.total_value,
        department: entry.department,
        remarks: entry.remarks
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="stores-ledger.xlsx"');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting ledger Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting ledger Excel',
      error: error.message
    });
  }
});

module.exports = router;