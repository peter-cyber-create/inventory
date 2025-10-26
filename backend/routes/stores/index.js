const express = require('express');
const router = express.Router();

// Import the 5 main stores modules
const grnRoutes = require('./grnRoutes');
const ledgerRoutes = require('./ledgerRoutes');
const issuanceRoutes = require('./issuanceRoutes');
const requisitionRoutes = require('./requisitionRoutes');
const reportsRoutes = require('./reportsRoutes');
const form76aRoutes = require('./form76aRoutes');

// Mount the 5 main stores modules
router.use('/grn', grnRoutes);           // Goods Received Notes
router.use('/ledger', ledgerRoutes);     // Stock Ledger
router.use('/issuance', issuanceRoutes); // Stock Issuance
router.use('/requisition', requisitionRoutes); // Requisitions (Form 76A)
router.use('/form76a', form76aRoutes);   // Form 76A specific routes
router.use('/reports', reportsRoutes);   // Stores Reports

// Legacy routes for backward compatibility
const dashboardRoutes = require('./dashboardRoutes');
const itemRoutes = require('./itemRoutes');
const supplierRoutes = require('./supplierRoutes');
const locationRoutes = require('./locationRoutes');

router.use('/dashboard', dashboardRoutes);
router.use('/items', itemRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/locations', locationRoutes);

module.exports = router;