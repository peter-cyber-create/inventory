const AuditLog = require('../models/stores/auditLogModel');
const { sequelize } = require('../config/db');

/**
 * Audit Logging Middleware
 * Logs all sensitive operations for security and compliance
 */

// Audit log action types
const AUDIT_ACTIONS = {
  // Authentication
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  
  // User Management
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_DELETE: 'USER_DELETE',
  USER_ACTIVATE: 'USER_ACTIVATE',
  USER_DEACTIVATE: 'USER_DEACTIVATE',
  
  // Data Operations
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT',
  IMPORT: 'IMPORT',
  
  // Financial Operations
  PAYMENT: 'PAYMENT',
  TRANSFER: 'TRANSFER',
  APPROVAL: 'APPROVAL',
  REJECTION: 'REJECTION',
  
  // System Operations
  CONFIG_CHANGE: 'CONFIG_CHANGE',
  BACKUP: 'BACKUP',
  RESTORE: 'RESTORE',
  SYSTEM_UPDATE: 'SYSTEM_UPDATE'
};

/**
 * Create audit log entry
 * @param {Object} options - Audit log options
 * @param {string} options.action - Action type (from AUDIT_ACTIONS)
 * @param {string} options.entity - Entity type (e.g., 'user', 'asset', 'grn')
 * @param {number} options.entityId - Entity ID
 * @param {Object} options.oldValues - Previous values (for updates)
 * @param {Object} options.newValues - New values
 * @param {Object} options.req - Express request object
 * @param {string} options.status - Status (success, failure, warning)
 * @param {string} options.message - Additional message
 */
const createAuditLog = async (options) => {
  try {
    const {
      action,
      entity,
      entityId,
      oldValues = null,
      newValues = null,
      req,
      status = 'success',
      message = null
    } = options;

    // Get user ID from request (if authenticated)
    const userId = req?.user?.id || null;
    const username = req?.user?.username || 'system';
    
    // Get IP address
    const ipAddress = req?.ip || 
                     req?.connection?.remoteAddress || 
                     req?.headers?.['x-forwarded-for']?.split(',')[0] || 
                     'unknown';
    
    // Get user agent
    const userAgent = req?.get('User-Agent') || 'unknown';

    // Create audit log entry
    await AuditLog.create({
      action,
      entity: entity || 'system',
      entity_id: entityId || null,
      old_values: oldValues ? JSON.stringify(oldValues) : null,
      new_values: newValues ? JSON.stringify(newValues) : null,
      user_id: userId,
      username: username,
      ip_address: ipAddress,
      user_agent: userAgent,
      status: status,
      message: message,
      timestamp: new Date()
    });
  } catch (error) {
    // Don't throw error - audit logging should not break the application
    // But log it for debugging
    console.error('Audit logging failed:', error);
  }
};

/**
 * Middleware to automatically log requests
 * Use this for routes that need automatic audit logging
 */
const auditMiddleware = (action, entity) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      // Log after response is sent
      const status = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failure';
      
      createAuditLog({
        action,
        entity,
        entityId: req.params?.id || req.body?.id || null,
        newValues: req.body,
        req,
        status,
        message: `HTTP ${req.method} ${req.path} - ${res.statusCode}`
      });
      
      return originalJson(data);
    };
    
    next();
  };
};

/**
 * Log authentication events
 */
const logAuthEvent = async (action, req, username, success, message = null) => {
  await createAuditLog({
    action,
    entity: 'authentication',
    req,
    status: success ? 'success' : 'failure',
    message: message || `${action} ${success ? 'succeeded' : 'failed'} for user: ${username}`
  });
};

/**
 * Log data modification events
 */
const logDataModification = async (action, entity, entityId, oldValues, newValues, req) => {
  await createAuditLog({
    action,
    entity,
    entityId,
    oldValues,
    newValues,
    req,
    status: 'success'
  });
};

/**
 * Log sensitive operations
 */
const logSensitiveOperation = async (action, entity, details, req) => {
  await createAuditLog({
    action,
    entity,
    newValues: { details },
    req,
    status: 'success',
    message: `Sensitive operation: ${action} on ${entity}`
  });
};

module.exports = {
  AUDIT_ACTIONS,
  createAuditLog,
  auditMiddleware,
  logAuthEvent,
  logDataModification,
  logSensitiveOperation
};











