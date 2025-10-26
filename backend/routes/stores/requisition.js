const express = require('express');
const router = express.Router();
const Requisition = require('../../models/stores/requisitionModel');

// Create a new requisition
router.post('/', async (req, res) => {
  try {
    const requisition = new Requisition(req.body);
    await requisition.save();
    res.status(201).json(requisition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all requisitions
router.get('/', async (req, res) => {
  try {
    const requisitions = await Requisition.find();
    res.json(requisitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single requisition by ID
router.get('/:id', async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id);
    if (!requisition) return res.status(404).json({ error: 'Not found' });
    res.json(requisition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
