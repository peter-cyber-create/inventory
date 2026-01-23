const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Rate limiting middleware
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            status: 'error',
            message: message || 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// General API rate limiting
const generalLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many API requests from this IP, please try again later.'
);

// Auth rate limiting (stricter)
const authLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 login attempts per windowMs
    'Too many login attempts from this IP, please try again later.'
);

// Upload rate limiting
const uploadLimiter = createRateLimit(
    60 * 60 * 1000, // 1 hour
    20, // limit each IP to 20 uploads per hour
    'Too many file uploads from this IP, please try again later.'
);

// Security headers middleware
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        // In production, be more permissive if CORS_ORIGIN is not set
        const isProduction = process.env.NODE_ENV === 'production';
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://172.27.0.10',
            'http://172.27.0.10:80',
            'http://172.27.0.10:3000',
            process.env.FRONTEND_URL,
            process.env.CORS_ORIGIN
        ].filter(Boolean);
        
        // In production, allow any origin if CORS_ORIGIN is not configured
        // This is less secure but ensures the app works
        // For better security, set CORS_ORIGIN in production.env
        if (isProduction && !process.env.CORS_ORIGIN && !process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        
        // Check if origin matches allowed list or contains the domain
        const originMatches = allowedOrigins.some(allowed => {
            if (!allowed) return false;
            // Exact match
            if (origin === allowed) return true;
            // Domain match (for subdomains)
            if (origin.startsWith(allowed.replace(/^https?:\/\//, 'http://'))) return true;
            // Check if origin contains the allowed domain
            try {
                const originUrl = new URL(origin);
                const allowedUrl = new URL(allowed);
                return originUrl.hostname === allowedUrl.hostname;
            } catch (e) {
                return false;
            }
        });
        
        if (originMatches || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // In production, log but allow if no CORS_ORIGIN is set
            if (isProduction && !process.env.CORS_ORIGIN) {
                console.warn(`CORS: Allowing origin ${origin} (CORS_ORIGIN not set)`);
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Input validation middleware
const validateInput = (req, res, next) => {
    // Basic XSS protection
    const sanitizeInput = (obj) => {
        if (typeof obj === 'string') {
            return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                obj[key] = sanitizeInput(obj[key]);
            }
        }
        return obj;
    };

    if (req.body) {
        req.body = sanitizeInput(req.body);
    }
    if (req.query) {
        req.query = sanitizeInput(req.query);
    }
    if (req.params) {
        req.params = sanitizeInput(req.params);
    }

    next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        };
        
        // Log only errors in production, all requests in development
        if (process.env.NODE_ENV === 'development' || res.statusCode >= 400) {
            console.log(`[${logData.timestamp}] ${logData.method} ${logData.url} ${logData.status} ${logData.duration}`);
        }
    });
    
    next();
};

// Database connection check middleware
const checkDatabaseConnection = async (req, res, next) => {
    const { checkConnection } = require('../config/db');
    const isConnected = await checkConnection();
    
    if (!isConnected) {
        return res.status(503).json({
            status: 'error',
            message: 'Database connection unavailable. Please try again later.'
        });
    }
    
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Log errors securely - don't log sensitive data in production
    if (isDevelopment) {
        console.error('Error:', err);
    } else {
        // In production, log only safe error information
        const safeError = {
            name: err.name,
            message: err.message,
            status: err.status || 500,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
        };
        // Remove any sensitive fields that might be in error object
        console.error('Error:', JSON.stringify(safeError));
    }
    
    // Don't leak error details in production
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation error',
            errors: isDevelopment ? err.errors : undefined
        });
    }
    
    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Database validation error',
            errors: isDevelopment ? err.errors : undefined
        });
    }
    
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            status: 'error',
            message: 'Duplicate entry',
            field: isDevelopment ? (err.errors && err.errors[0] ? err.errors[0].path : undefined) : undefined
        });
    }
    
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Token expired'
        });
    }
    
    // Handle database connection errors
    if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
        return res.status(503).json({
            status: 'error',
            message: 'Database connection unavailable. Please try again later.'
        });
    }
    
    if (err.name === 'SequelizeDatabaseError') {
        return res.status(500).json({
            status: 'error',
            message: isDevelopment ? err.message : 'Database operation failed'
        });
    }
    
    // Handle timeout errors
    if (err.name === 'SequelizeTimeoutError') {
        return res.status(504).json({
            status: 'error',
            message: 'Database operation timed out. Please try again.'
        });
    }
    
    // Default error
    res.status(err.status || 500).json({
        status: 'error',
        message: isDevelopment ? err.message : 'Internal server error',
        stack: isDevelopment ? err.stack : undefined
    });
};

module.exports = {
    generalLimiter,
    authLimiter,
    uploadLimiter,
    securityHeaders,
    corsOptions,
    validateInput,
    requestLogger,
    checkDatabaseConnection,
    errorHandler
};
