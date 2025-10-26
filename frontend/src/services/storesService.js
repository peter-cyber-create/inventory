import api from './api';

export const storesService = {
  // Dashboard
  getDashboard: () => api.get('/stores/dashboard'),

  // Items
  getItems: (params) => api.get('/stores/items', { params }),
  getItem: (id) => api.get(`/stores/items/${id}`),
  createItem: (data) => api.post('/stores/items', data),
  updateItem: (id, data) => api.put(`/stores/items/${id}`, data),
  deleteItem: (id) => api.delete(`/stores/items/${id}`),
  getItemCategories: () => api.get('/stores/items/categories/list'),
  getLowStockItems: () => api.get('/stores/items/reports/low-stock'),

  // Suppliers
  getSuppliers: (params) => api.get('/stores/suppliers', { params }),
  getSupplier: (id) => api.get(`/stores/suppliers/${id}`),
  createSupplier: (data) => api.post('/stores/suppliers', data),
  updateSupplier: (id, data) => api.put(`/stores/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/stores/suppliers/${id}`),
  getActiveSuppliers: () => api.get('/stores/suppliers/list/active'),

  // Locations
  getLocations: (params) => api.get('/stores/locations', { params }),
  getLocation: (id) => api.get(`/stores/locations/${id}`),
  createLocation: (data) => api.post('/stores/locations', data),
  updateLocation: (id, data) => api.put(`/stores/locations/${id}`, data),
  deleteLocation: (id) => api.delete(`/stores/locations/${id}`),
  getActiveLocations: () => api.get('/stores/locations/list/active'),

  // Form5 Uploads
  uploadForm5: (formData) => api.post('/stores/form5/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getForm5Uploads: (params) => api.get('/stores/form5', { params }),
  getForm5Upload: (id) => api.get(`/stores/form5/${id}`),

  // Consignment Data
  getConsignments: (params) => api.get('/stores/consignments', { params }),
  getConsignment: (id) => api.get(`/stores/consignments/${id}`),
  createConsignment: (data) => api.post('/stores/consignments', data),
  updateConsignment: (id, data) => api.put(`/stores/consignments/${id}`, data),

  // GRN (Goods Received Notes)
  getGRNs: (params) => api.get('/stores/grn', { params }),
  getGRN: (id) => api.get(`/stores/grn/${id}`),
  createGRN: (data) => api.post('/stores/grn', data),
  updateGRN: (id, data) => api.put(`/stores/grn/${id}`, data),
  approveGRN: (id, data) => api.patch(`/stores/grn/${id}/approve`, data),
  rejectGRN: (id, data) => api.patch(`/stores/grn/${id}/reject`, data),

  // Stock Ledger
  getStockLedger: (params) => api.get('/stores/ledger', { params }),
  getItemLedger: (itemId, params) => api.get(`/stores/ledger/item/${itemId}`, { params }),

  // Stock Balance
  getStockBalances: (params) => api.get('/stores/stock-balance', { params }),
  getItemStockBalance: (itemId) => api.get(`/stores/stock-balance/item/${itemId}`),

  // Requisitions
  getRequisitions: (params) => api.get('/stores/requisitions', { params }),
  getRequisition: (id) => api.get(`/stores/requisitions/${id}`),
  createRequisition: (data) => api.post('/stores/requisitions', data),
  updateRequisition: (id, data) => api.put(`/stores/requisitions/${id}`, data),
  approveRequisition: (id, data) => api.patch(`/stores/requisitions/${id}/approve`, data),
  rejectRequisition: (id, data) => api.patch(`/stores/requisitions/${id}/reject`, data),
  
  // Official Requisition Form
  createRequisitionForm: (data) => api.post('/stores/requisition-form', data),
  getRequisitionForm: (id) => api.get(`/stores/requisition-form/${id}`),
  getRequisitionForms: (params) => api.get('/stores/requisition-form', { params }),

  // Form 76A (Stores Requisition/Issue Voucher)
  createForm76A: (data) => api.post('/stores/form76a', data),
  getForm76A: (id) => api.get(`/stores/form76a/${id}`),
  getForm76AList: (params) => api.get('/stores/form76a', { params }),
  updateForm76A: (id, data) => api.put(`/stores/form76a/${id}`, data),
  updateForm76AStatus: (id, data) => api.patch(`/stores/form76a/${id}/status`, data),
  generateForm76APDF: (id) => api.get(`/stores/form76a/${id}/pdf`, { responseType: 'blob' }),
  deleteForm76A: (id) => api.delete(`/stores/form76a/${id}`),

  // GRN (Goods Received Notes)
  createGRN: (data) => api.post('/stores/grn', data),
  getGRN: (id) => api.get(`/stores/grn/${id}`),
  getGRNs: (params) => api.get('/stores/grn', { params }),
  updateGRN: (id, data) => api.put(`/stores/grn/${id}`, data),
  approveGRN: (id, data) => api.patch(`/stores/grn/${id}/status`, { status: 'approved', ...data }),
  rejectGRN: (id, data) => api.patch(`/stores/grn/${id}/status`, { status: 'rejected', ...data }),
  deleteGRN: (id) => api.delete(`/stores/grn/${id}`),

  // Stock Ledger
  getStockLedger: (params) => api.get('/stores/ledger', { params }),
  getItemLedger: (itemId, params) => api.get(`/stores/ledger/item/${itemId}`, { params }),
  getStockBalances: (params) => api.get('/stores/ledger/balance', { params }),
  getLowStockItems: (params) => api.get('/stores/ledger/low-stock', { params }),
  getMovementSummary: (params) => api.get('/stores/ledger/movement/summary', { params }),

  // Stock Issuance
  createIssuance: (data) => api.post('/stores/issuance', data),
  getIssuance: (id) => api.get(`/stores/issuance/${id}`),
  getIssuances: (params) => api.get('/stores/issuance', { params }),
  updateIssuance: (id, data) => api.put(`/stores/issuance/${id}`, data),
  getRequisitionIssuances: (requisitionId) => api.get(`/stores/issuance/requisition/${requisitionId}`),
  deleteIssuance: (id) => api.delete(`/stores/issuance/${id}`),

  // Reports
  getDashboardStats: () => api.get('/stores/reports/dashboard-stats'),
  getStockMovementReport: (params) => api.get('/stores/reports/stock-movement', { params }),
  getStockBalanceReport: (params) => api.get('/stores/reports/stock-balance', { params }),
  getConsumptionReport: (params) => api.get('/stores/reports/consumption', { params }),
  getAgingReport: (params) => api.get('/stores/reports/aging', { params }),
  getValuationReport: (params) => api.get('/stores/reports/valuation', { params }),
  getGRNSummaryReport: (params) => api.get('/stores/reports/grn-summary', { params }),
  getIssuanceSummaryReport: (params) => api.get('/stores/reports/issuance-summary', { params }),

  // Issuances
  getIssuances: (params) => api.get('/stores/issuances', { params }),
  getIssuance: (id) => api.get(`/stores/issuances/${id}`),
  createIssuance: (data) => api.post('/stores/issuances', data),
  updateIssuance: (id, data) => api.put(`/stores/issuances/${id}`, data),

  // Returns
  getReturns: (params) => api.get('/stores/returns', { params }),
  getReturn: (id) => api.get(`/stores/returns/${id}`),
  createReturn: (data) => api.post('/stores/returns', data),
  updateReturn: (id, data) => api.put(`/stores/returns/${id}`, data),
  approveReturn: (id, data) => api.patch(`/stores/returns/${id}/approve`, data),

  // Adjustments
  getAdjustments: (params) => api.get('/stores/adjustments', { params }),
  getAdjustment: (id) => api.get(`/stores/adjustments/${id}`),
  createAdjustment: (data) => api.post('/stores/adjustments', data),
  updateAdjustment: (id, data) => api.put(`/stores/adjustments/${id}`, data),
  approveAdjustment: (id, data) => api.patch(`/stores/adjustments/${id}/approve`, data),

  // Audit Logs
  getAuditLogs: (params) => api.get('/stores/audit-logs', { params }),

  // Reports
  getStockMovementReport: (params) => api.get('/stores/reports/stock-movement', { params }),
  getConsumptionReport: (params) => api.get('/stores/reports/consumption', { params }),
  getAgingReport: (params) => api.get('/stores/reports/aging', { params }),
  getValuationReport: (params) => api.get('/stores/reports/valuation', { params }),
  exportReport: (reportType, params) => api.get(`/stores/reports/${reportType}/export`, { 
    params,
    responseType: 'blob'
  })
};
