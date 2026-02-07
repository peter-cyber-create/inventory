import API from '../helpers/api';

export const storesService = {
  // Dashboard
  getDashboard: () => API.get('/api/stores/dashboard'),

  // Items
  getItems: (params) => API.get('/api/stores/items', { params }),
  getItem: (id) => API.get(`/api/stores/items/${id}`),
  createItem: (data) => API.post('/api/stores/items', data),
  updateItem: (id, data) => API.put(`/api/stores/items/${id}`, data),
  deleteItem: (id) => API.delete(`/api/stores/items/${id}`),
  getItemCategories: () => API.get('/api/stores/items/categories/list'),
  getLowStockItems: (params) => API.get('/api/stores/ledger/low-stock', { params }),

  // Suppliers
  getSuppliers: (params) => API.get('/api/stores/suppliers', { params }),
  getSupplier: (id) => API.get(`/api/stores/suppliers/${id}`),
  createSupplier: (data) => API.post('/api/stores/suppliers', data),
  updateSupplier: (id, data) => API.put(`/api/stores/suppliers/${id}`, data),
  deleteSupplier: (id) => API.delete(`/api/stores/suppliers/${id}`),
  getActiveSuppliers: () => API.get('/api/stores/suppliers/list/active'),

  // Locations
  getLocations: (params) => API.get('/api/stores/locations', { params }),
  getLocation: (id) => API.get(`/api/stores/locations/${id}`),
  createLocation: (data) => API.post('/api/stores/locations', data),
  updateLocation: (id, data) => API.put(`/api/stores/locations/${id}`, data),
  deleteLocation: (id) => API.delete(`/api/stores/locations/${id}`),
  getActiveLocations: () => API.get('/api/stores/locations/list/active'),

  // Form5 Uploads
  uploadForm5: (formData) => API.post('/api/stores/form5/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getForm5Uploads: (params) => API.get('/api/stores/form5', { params }),
  getForm5Upload: (id) => API.get(`/api/stores/form5/${id}`),

  // Consignment Data
  getConsignments: (params) => API.get('/api/stores/consignments', { params }),
  getConsignment: (id) => API.get(`/api/stores/consignments/${id}`),
  createConsignment: (data) => API.post('/api/stores/consignments', data),
  updateConsignment: (id, data) => API.put(`/api/stores/consignments/${id}`, data),

  // Form 76A (Stores Requisition/Issue Voucher)
  createForm76A: (data) => API.post('/api/stores/form76a', data),
  getForm76A: (id) => API.get(`/api/stores/form76a/${id}`),
  getForm76AList: (params) => API.get('/api/stores/form76a', { params }),
  updateForm76A: (id, data) => API.put(`/api/stores/form76a/${id}`, data),
  updateForm76AStatus: (id, data) => API.patch(`/api/stores/form76a/${id}/status`, data),
  generateForm76APDF: (id) => API.get(`/api/stores/form76a/${id}/pdf`, { responseType: 'blob' }),
  deleteForm76A: (id) => API.delete(`/api/stores/form76a/${id}`),

  // GRN (Goods Received Notes)
  createGRN: (data) => API.post('/api/stores/grn', data),
  getGRN: (id) => API.get(`/api/stores/grn/${id}`),
  getGRNs: (params) => API.get('/api/stores/grn', { params }),
  updateGRN: (id, data) => API.put(`/api/stores/grn/${id}`, data),
  approveGRN: (id, data) => API.patch(`/api/stores/grn/${id}/status`, { status: 'approved', ...data }),
  rejectGRN: (id, data) => API.patch(`/api/stores/grn/${id}/status`, { status: 'rejected', ...data }),
  deleteGRN: (id) => API.delete(`/api/stores/grn/${id}`),

  // Stock Ledger
  getStockLedger: (params) => API.get('/api/stores/ledger', { params }),
  getItemLedger: (itemId, params) => API.get(`/api/stores/ledger/item/${itemId}`, { params }),
  getStockBalances: (params) => API.get('/api/stores/ledger/balance', { params }),
  getLowStockItemsFromLedger: (params) => API.get('/api/stores/ledger/low-stock', { params }),
  getMovementSummary: (params) => API.get('/api/stores/ledger/movement/summary', { params }),
  createManualLedgerEntry: (data) => API.post('/api/stores/ledger', data),
  exportLedgerPDF: (params) => API.get('/api/stores/ledger/export/pdf', { params, responseType: 'blob' }),
  exportLedgerExcel: (params) => API.get('/api/stores/ledger/export/excel', { params, responseType: 'blob' }),

  // Stock Issuance
  createIssuance: (data) => API.post('/api/stores/issuance', data),
  getIssuance: (id) => API.get(`/api/stores/issuance/${id}`),
  getIssuances: (params) => API.get('/api/stores/issuance', { params }),
  updateIssuance: (id, data) => API.put(`/api/stores/issuance/${id}`, data),
  getRequisitionIssuances: (requisitionId) => API.get(`/api/stores/issuance/requisition/${requisitionId}`),
  deleteIssuance: (id) => API.delete(`/api/stores/issuance/${id}`),

  // Reports
  getDashboardStats: () => API.get('/api/stores/reports/dashboard-stats'),
  getStockMovementReport: (params) => API.get('/api/stores/reports/stock-movement', { params }),
  getStockBalanceReport: (params) => API.get('/api/stores/reports/stock-balance', { params }),
  getConsumptionReport: (params) => API.get('/api/stores/reports/consumption', { params }),
  getAgingReport: (params) => API.get('/api/stores/reports/aging', { params }),
  getValuationReport: (params) => API.get('/api/stores/reports/valuation', { params }),
  getGRNSummaryReport: (params) => API.get('/api/stores/reports/grn-summary', { params }),
  getIssuanceSummaryReport: (params) => API.get('/api/stores/reports/issuance-summary', { params }),

  // Returns
  getReturns: (params) => API.get('/api/stores/returns', { params }),
  getReturn: (id) => API.get(`/api/stores/returns/${id}`),
  createReturn: (data) => API.post('/api/stores/returns', data),
  updateReturn: (id, data) => API.put(`/api/stores/returns/${id}`, data),
  approveReturn: (id, data) => API.patch(`/api/stores/returns/${id}/approve`, data),

  // Adjustments
  getAdjustments: (params) => API.get('/api/stores/adjustments', { params }),
  getAdjustment: (id) => API.get(`/api/stores/adjustments/${id}`),
  createAdjustment: (data) => API.post('/api/stores/adjustments', data),
  updateAdjustment: (id, data) => API.put(`/api/stores/adjustments/${id}`, data),
  approveAdjustment: (id, data) => API.patch(`/api/stores/adjustments/${id}/approve`, data),

  // Audit Logs
  getAuditLogs: (params) => API.get('/api/stores/audit-logs', { params }),

  // Report Export
  exportReport: (reportType, params) => API.get(`/api/stores/reports/${reportType}/export`, { 
    params,
    responseType: 'blob'
  })
};
