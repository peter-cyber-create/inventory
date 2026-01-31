/**
 * Role-Based Authorization Middleware
 * Ministry of Health Uganda - Inventory Management System
 * 
 * This middleware checks if the authenticated user has the required role(s)
 * to access a specific route.
 * 
 * Usage:
 *   router.post("/", Auth, authorize('admin', 'it'), async (req, res, next) => {
 *     // Route handler
 *   });
 */

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // Ensure user is authenticated (Auth middleware should run first)
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - User not authenticated'
            });
        }

        // Get user role
        const userRole = req.user.role;

        // Check if user role is in allowed roles
        if (!allowedRoles || allowedRoles.length === 0) {
            // No roles specified - allow all authenticated users
            return next();
        }

        // Admin has access to everything
        if (userRole === 'admin') {
            return next();
        }

        // Check if user's role is in allowed roles
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                status: 'error',
                message: `Forbidden - Access denied. Required role(s): ${allowedRoles.join(', ')}`,
                userRole: userRole,
                requiredRoles: allowedRoles
            });
        }

        // User has required role - proceed
        next();
    };
};

module.exports = authorize;
