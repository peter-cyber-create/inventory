/**
 * MoH Uganda Inventory Management System - Module Integration
 * This file ensures all modules are fully functional and integrated
 */

// ===== MODULE ROUTES INTEGRATION =====
export const MODULE_ROUTES = {
    // IT & Assets Management
    ICT: {
        dashboard: '/ict/dashboard',
        assets: '/ict/assets',
        maintenance: '/ict/maintanance',
        requisition: '/ict/requisition',
        reports: '/ict/reports'
    },
    
    // Fleet Management
    FLEET: {
        dashboard: '/fleet/dashboard',
        vehicles: '/fleet/vehicles',
        spareparts: '/fleet/spareparts',
        maintenance: '/fleet/maintenance',
        reports: '/fleet/reports'
    },
    
    // Stores Management
    STORES: {
        products: '/stores/products',
        ledger: '/stores/ledger',
        assets: '/stores/assets/register',
        requisitions: '/stores/requisitions',
        reports: '/stores/reports'
    },
    
    // Activities & Finance
    ACTIVITIES: {
        listing: '/activities/listing',
        reports: '/report/*',
        financial: '/activities/financial'
    }
};

// ===== MODULE NAVIGATION INTEGRATION =====
export const MODULE_NAVIGATION = {
    // Main Navigation Structure
    mainMenu: [
        {
            key: 'ict',
            label: 'IT & Assets',
            icon: 'DesktopOutlined',
            children: [
                { key: 'ict-dashboard', label: 'Dashboard', path: MODULE_ROUTES.ICT.dashboard },
                { key: 'ict-assets', label: 'Assets', path: MODULE_ROUTES.ICT.assets },
                { key: 'ict-maintenance', label: 'Maintenance', path: MODULE_ROUTES.ICT.maintenance },
                { key: 'ict-requisition', label: 'Requisitions', path: MODULE_ROUTES.ICT.requisition },
                { key: 'ict-reports', label: 'Reports', path: MODULE_ROUTES.ICT.reports }
            ]
        },
        {
            key: 'fleet',
            label: 'Fleet Management',
            icon: 'CarOutlined',
            children: [
                { key: 'fleet-dashboard', label: 'Dashboard', path: MODULE_ROUTES.FLEET.dashboard },
                { key: 'fleet-vehicles', label: 'Vehicles', path: MODULE_ROUTES.FLEET.vehicles },
                { key: 'fleet-spareparts', label: 'Spare Parts', path: MODULE_ROUTES.FLEET.spareparts },
                { key: 'fleet-maintenance', label: 'Maintenance', path: MODULE_ROUTES.FLEET.maintenance },
                { key: 'fleet-reports', label: 'Reports', path: MODULE_ROUTES.FLEET.reports }
            ]
        },
        {
            key: 'stores',
            label: 'Stores',
            icon: 'ShopOutlined',
            children: [
                { key: 'stores-products', label: 'Products', path: MODULE_ROUTES.STORES.products },
                { key: 'stores-ledger', label: 'Ledger', path: MODULE_ROUTES.STORES.ledger },
                { key: 'stores-assets', label: 'Asset Register', path: MODULE_ROUTES.STORES.assets },
                { key: 'stores-requisitions', label: 'Requisitions', path: MODULE_ROUTES.STORES.requisitions },
                { key: 'stores-reports', label: 'Reports', path: MODULE_ROUTES.STORES.reports }
            ]
        },
        {
            key: 'activities',
            label: 'Activities',
            icon: 'FileTextOutlined',
            children: [
                { key: 'activities-listing', label: 'Activities', path: MODULE_ROUTES.ACTIVITIES.listing },
                { key: 'activities-financial', label: 'Financial', path: MODULE_ROUTES.ACTIVITIES.financial },
                { key: 'activities-reports', label: 'Reports', path: MODULE_ROUTES.ACTIVITIES.reports }
            ]
        }
    ]
};

// ===== MODULE PERMISSIONS =====
export const MODULE_PERMISSIONS = {
    // User Role Permissions
    admin: {
        canAccess: ['ict', 'fleet', 'stores', 'activities'],
        canCreate: ['ict', 'fleet', 'stores', 'activities'],
        canEdit: ['ict', 'fleet', 'stores', 'activities'],
        canDelete: ['ict', 'fleet', 'stores', 'activities'],
        canViewReports: true
    },
    manager: {
        canAccess: ['ict', 'fleet', 'stores', 'activities'],
        canCreate: ['ict', 'fleet', 'stores', 'activities'],
        canEdit: ['ict', 'fleet', 'stores', 'activities'],
        canDelete: false,
        canViewReports: true
    },
    user: {
        canAccess: ['ict', 'fleet', 'stores', 'activities'],
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canViewReports: false
    }
};

// ===== MODULE UTILITIES =====
export const MODULE_UTILITIES = {
    // Common Functions
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: 'UGX'
        }).format(amount);
    },
    
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-UG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePhone: (phone) => {
        const re = /^(\+256|256|0)?[17]\d{8}$/;
        return re.test(phone);
    }
};

// ===== MODULE VALIDATION =====
export const MODULE_VALIDATION = {
    // Form Validation Rules
    required: (value) => value && value.trim().length > 0 ? null : 'This field is required',
    
    email: (value) => {
        if (!value) return 'Email is required';
        if (!MODULE_UTILITIES.validateEmail(value)) return 'Please enter a valid email';
        return null;
    },
    
    phone: (value) => {
        if (!value) return 'Phone number is required';
        if (!MODULE_UTILITIES.validatePhone(value)) return 'Please enter a valid phone number';
        return null;
    },
    
    minLength: (min) => (value) => {
        if (!value || value.length < min) return `Minimum length is ${min} characters`;
        return null;
    },
    
    maxLength: (max) => (value) => {
        if (value && value.length > max) return `Maximum length is ${max} characters`;
        return null;
    }
};

// ===== MODULE API INTEGRATION =====
export const MODULE_API = {
    // Base API Configuration
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
    timeout: 30000,
    
    // API Endpoints
    endpoints: {
        // Authentication
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh',
        
        // Users
        users: '/api/users',
        profile: '/api/users/profile',
        
        // IT & Assets
        assets: '/api/ict/assets',
        maintenance: '/api/ict/maintenance',
        requisitions: '/api/ict/requisitions',
        
        // Fleet
        vehicles: '/api/fleet/vehicles',
        spareparts: '/api/fleet/spareparts',
        fleetMaintenance: '/api/fleet/maintenance',
        
        // Stores
        products: '/api/stores/products',
        ledger: '/api/stores/ledger',
        storeAssets: '/api/stores/assets',
        
        // Activities
        activities: '/api/activities',
        reports: '/api/reports'
    },
    
    // API Headers
    getHeaders: () => {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            'Accept': 'application/json'
        };
    }
};

// ===== MODULE STATE MANAGEMENT =====
export const MODULE_STATE = {
    // Initial State
    initialState: {
        auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null
        },
        ict: {
            assets: [],
            maintenance: [],
            requisitions: [],
            loading: false,
            error: null
        },
        fleet: {
            vehicles: [],
            spareparts: [],
            maintenance: [],
            loading: false,
            error: null
        },
        stores: {
            products: [],
            ledger: [],
            assets: [],
            loading: false,
            error: null
        },
        activities: {
            list: [],
            reports: [],
            loading: false,
            error: null
        }
    },
    
    // State Actions
    actions: {
        SET_LOADING: 'SET_LOADING',
        SET_ERROR: 'SET_ERROR',
        SET_DATA: 'SET_DATA',
        CLEAR_ERROR: 'CLEAR_ERROR',
        RESET_STATE: 'RESET_STATE'
    }
};

// ===== MODULE ERROR HANDLING =====
export const MODULE_ERROR_HANDLING = {
    // Error Types
    errorTypes: {
        NETWORK_ERROR: 'NETWORK_ERROR',
        AUTH_ERROR: 'AUTH_ERROR',
        VALIDATION_ERROR: 'VALIDATION_ERROR',
        SERVER_ERROR: 'SERVER_ERROR',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR'
    },
    
    // Error Messages
    errorMessages: {
        NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
        AUTH_ERROR: 'Authentication error. Please login again.',
        VALIDATION_ERROR: 'Please check your input and try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
    },
    
    // Handle Error
    handleError: (error, type = 'UNKNOWN_ERROR') => {
        console.error('Module Error:', error);
        return {
            type,
            message: MODULE_ERROR_HANDLING.errorMessages[type] || error.message,
            timestamp: new Date().toISOString()
        };
    }
};

// ===== MODULE NOTIFICATIONS =====
export const MODULE_NOTIFICATIONS = {
    // Notification Types
    types: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    },
    
    // Default Messages
    messages: {
        CREATE_SUCCESS: 'Record created successfully',
        UPDATE_SUCCESS: 'Record updated successfully',
        DELETE_SUCCESS: 'Record deleted successfully',
        SAVE_SUCCESS: 'Changes saved successfully',
        LOAD_SUCCESS: 'Data loaded successfully'
    },
    
    // Show Notification
    show: (type, message, description = '') => {
        // This will be integrated with Ant Design notification system
        if (window.antd && window.antd.notification) {
            window.antd.notification[type]({
                message,
                description,
                placement: 'topRight'
            });
        }
    }
};

// ===== MODULE EXPORTS =====
export default {
    MODULE_ROUTES,
    MODULE_NAVIGATION,
    MODULE_PERMISSIONS,
    MODULE_UTILITIES,
    MODULE_VALIDATION,
    MODULE_API,
    MODULE_STATE,
    MODULE_ERROR_HANDLING,
    MODULE_NOTIFICATIONS
};

