import api from '../helpers/api';

export const storesService = {
  // Dashboard
  getDashboard: () => api.get('/api/api/stores/dashboard'),

  // Items
  getItems: (params) => api.get('/api/api/stores/items', { params }),
  getItem: (id) => api.get(`/api/api/stores/items/${id}`),
  createItem: (data) => api.post('/api/api/stores/items', data),
  updateItem: (id, data) => api.put(`/api/api/stores/items/${id}`, data),
  deleteItem: (id) => api.delete(`/api/api/stores/items/${id}`),
  getItemCategories: () => api.get('/api/api/stores/items/categories/list'),
  getLowStockItems: () => api.get('/api/api/stores/items/reports/low-stock'),

  // Suppliers
  getSuppliers: (params) => api.get('/api/stores/suppliers', { params }),
  getSupplier: (id) => api.get(`/api/stores/suppliers/${id}`),
  createSupplier: (data) => api.post('/api/stores/suppliers', data),
  updateSupplier: (id, data) => api.put(`/api/stores/suppliers/${id}`, data),
  deleteSupplier: (id) => api.delete(`/api/stores/suppliers/${id}`),
  getActiveSuppliers: () => api.get('/api/stores/suppliers/list/active'),

  // Locations
  getLocations: (params) => api.get('/api/stores/locations', { params }),
  getLocation: (id) => api.get(`/api/stores/locations/${id}`),
  createLocation: (data) => api.post('/api/stores/locations', data),
  updateLocation: (id, data) => api.put(`/api/stores/locations/${id}`, data),
  deleteLocation: (id) => api.delete(`/api/stores/locations/${id}`),
  getActiveLocations: () => api.get('/api/stores/locations/list/active'),

  // Form5 Uploads
  uploadForm5: (formData) => api.post('/api/stores/form5/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getForm5Uploads: (params) => api.get('/api/stores/form5', { params }),
  getForm5Upload: (id) => api.get(`/api/stores/form5/${id}`),

  // Consignment Data
  getConsignments: (params) => api.get('/api/stores/consignments', { params }),
  getConsignment: (id) => api.get(`/api/stores/consignments/${id}`),
  createConsignment: (data) => api.post('/api/stores/consignments', data),
  updateConsignment: (id, data) => api.put(`/api/stores/consignments/${id}`, data),

  // Form 76A (Stores Requisition/Issue Voucher)
  createForm76A: (data) => api.post('/api/stores/form76a', data),
  getForm76A: (id) => api.get(`/api/stores/form76a/${id}`),
  getForm76AList: (params) => api.get('/api/stores/form76a', { params }),
  updateForm76A: (id, data) => api.put(`/api/stores/form76a/${id}`, data),
  updateForm76AStatus: (id, data) => api.patch(`/api/stores/form76a/${id}/status`, data),
  generateForm76APDF: (id) => api.get(`/api/stores/form76a/${id}/pdf`, { responseType: 'blob' }),
  deleteForm76A: (id) => api.delete(`/api/stores/form76a/${id}`),

  // GRN (Goods Received Notes)
  createGRN: (data) => api.post('/api/stores/grn', data),
  getGRN: (id) => api.get(`/api/stores/grn/${id}`),
  getGRNs: (params) => api.get('/api/stores/grn', { params }),
  updateGRN: (id, data) => api.put(`/api/stores/grn/${id}`, data),
  approveGRN: (id, data) => api.patch(`/api/stores/grn/${id}/status`, { status: 'approved', ...data }),
  rejectGRN: (id, data) => api.patch(`/api/stores/grn/${id}/status`, { status: 'rejected', ...data }),
  deleteGRN: (id) => api.delete(`/api/stores/grn/${id}`),

  // Stock Ledger
  getStockLedger: (params) => api.get('/api/stores/ledger', { params }),
  getItemLedger: (itemId, params) => api.get(`/api/stores/ledger/item/${itemId}`, { params }),
  getStockBalances: (params) => api.get('/api/stores/ledger/balance', { params }),
  getLowStockItemsFromLedger: (params) => api.get('/api/stores/ledger/low-stock', { params }),
  getMovementSummary: (params) => api.get('/api/stores/ledger/movement/summary', { params }),
  createManualLedgerEntry: (data) => api.post('/api/stores/ledger', data),
  exportLedgerPDF: (params) => api.get('/api/stores/ledger/export/pdf', { params, responseType: 'blob' }),
  exportLedgerExcel: (params) => api.get('/api/stores/ledger/export/excel', { params, responseType: 'blob' }),

  // Stock Issuance
  createIssuance: (data) => api.post('/api/stores/issuance', data),
  getIssuance: (id) => api.get(`/api/stores/issuance/${id}`),
  getIssuances: (params) => api.get('/api/stores/issuance', { params }),
  updateIssuance: (id, data) => api.put(`/api/stores/issuance/${id}`, data),
  getRequisitionIssuances: (requisitionId) => api.get(`/api/stores/issuance/requisition/${requisitionId}`),
  deleteIssuance: (id) => api.delete(`/api/stores/issuance/${id}`),

  // Reports
  getDashboardStats: () => api.get('/api/stores/reports/dashboard-stats'),
  getStockMovementReport: (params) => api.get('/api/stores/reports/stock-movement', { params }),
  getStockBalanceReport: (params) => api.get('/api/stores/reports/stock-balance', { params }),
  getConsumptionReport: (params) => api.get('/api/stores/reports/consumption', { params }),
  getAgingReport: (params) => api.get('/api/stores/reports/aging', { params }),
  getValuationReport: (params) => api.get('/api/stores/reports/valuation', { params }),
  getGRNSummaryReport: (params) => api.get('/api/stores/reports/grn-summary', { params }),
  getIssuanceSummaryReport: (params) => api.get('/api/stores/reports/issuance-summary', { params }),

  // Returns
  getReturns: (params) => api.get('/api/stores/returns', { params }),
  getReturn: (id) => api.get(`/api/stores/returns/${id}`),
  createReturn: (data) => api.post('/api/stores/returns', data),
  updateReturn: (id, data) => api.put(`/api/stores/returns/${id}`, data),
  approveReturn: (id, data) => api.patch(`/api/stores/returns/${id}/approve`, data),

  // Adjustments
  getAdjustments: (params) => api.get('/api/stores/adjustments', { params }),
  getAdjustment: (id) => api.get(`/api/stores/adjustments/${id}`),
  createAdjustment: (data) => api.post('/api/stores/adjustments', data),
  updateAdjustment: (id, data) => api.put(`/api/stores/adjustments/${id}`, data),
  approveAdjustment: (id, data) => api.patch(`/api/stores/adjustments/${id}/approve`, data),

  // Audit Logs
  getAuditLogs: (params) => api.get('/api/stores/audit-logs', { params }),

  // Report Export
  exportReport: (reportType, params) => api.get(`/api/stores/reports/${reportType}/export`, { 
    params,
    responseType: 'blob'
  })
};
