

const express = require('express');
const dashboardRoutes = require('./dashboardRoutes.js');
const itemRoutes = require('./itemRoutes.js');
const supplierRoutes = require('./supplierRoutes.js');
const locationRoutes = require('./locationRoutes.js');
const requisitionFormRoutes = require('./requisitionForm.js');
const form76aRoutes = require('./form76aRoutes.js');

const router = express.Router();

// Mount routes
router.use('/dashboard', dashboardRoutes);
router.use('/items', itemRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/locations', locationRoutes);
router.use('/requisition', requisitionFormRoutes);
router.use('/requisition-form', requisitionFormRoutes);
router.use('/form76a', form76aRoutes);

module.exports = router;
