const express = require('express');
const router = express.Router();
const Requisition = require('../../models/stores/requisitionModel');
const RequisitionItem = require('../../models/stores/requisitionItemModel');
const RequisitionSignature = require('../../models/stores/requisitionSignatureModel');

// Create a new requisition with items and signatures
router.post('/', async (req, res) => {
  const t = await Requisition.sequelize.transaction();
  try {
    const { serialNo, fromDept, date, items, signatures } = req.body;
    // Create requisition
    const requisition = await Requisition.create({
      requisition_number: serialNo,
      department: fromDept,
      required_date: date
    }, { transaction: t });
    // Create items
    if (Array.isArray(items)) {
      for (const item of items) {
        await RequisitionItem.create({
          requisition_id: requisition.requisition_id,
          description: item.description,
          unit_of_issue: item.unitOfIssue,
          quantity_requested: item.quantityOrdered,
          quantity_approved: item.quantityApproved,
          quantity_issued: item.quantityIssued
        }, { transaction: t });
      }
    }
    // Create signatures
    if (Array.isArray(signatures)) {
      for (const sig of signatures) {
        await RequisitionSignature.create({
          requisition_id: requisition.requisition_id,
          role: sig.role,
          name: sig.name,
          signed_at: sig.signedAt
        }, { transaction: t });
      }
    }
    await t.commit();
    res.status(201).json({ message: 'Requisition created', id: requisition.requisition_id });
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
});

// Get all requisitions (with items and signatures)
router.get('/', async (req, res) => {
  try {
    const requisitions = await Requisition.findAll({
      include: [
        { model: RequisitionItem, as: 'items' },
        { model: RequisitionSignature, as: 'signatures' }
      ]
    });
    res.json(requisitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
