const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");
const UserModel = require("../../models/users/userModel.js");
const { validatePassword, validatePasswordMiddleware } = require("../../middleware/passwordPolicy.js");
const { logAuthEvent, logDataModification, AUDIT_ACTIONS } = require("../../middleware/auditLogger.js");

const router = express.Router();

// Bcrypt rounds - increased for better security (12 is recommended for production)
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

// Create new user (admin endpoint)
router.post("/", Auth, validatePasswordMiddleware, async (req, res, next) => {
    try {
        const { username, email, role, password, firstname, lastname, phone, designation, module, depart, health_email, department_id, is_active } = req.body;

        // Validate password policy
        const passwordValidation = validatePassword(password, username);
        if (!passwordValidation.valid) {
            return res.status(400).json({
                status: 'error',
                message: 'Password does not meet security requirements',
                errors: passwordValidation.errors
            });
        }

        const data = {
            username,
            email,
            role,
            firstname,
            lastname,
            phone,
            designation,
            module,
            depart,
            health_email,
            department_id,
            is_active: is_active !== undefined ? is_active : true,
            password: await bcrypt.hash(password, BCRYPT_ROUNDS),
        };

        const user = await UserModel.create(data);

        // Audit log user creation
        await logDataModification(
            AUDIT_ACTIONS.USER_CREATE,
            'user',
            user.id,
            null,
            { username, email, role, is_active },
            req
        );

        res.status(201).json({ 
            status: 'success', 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                firstname: user.firstname,
                lastname: user.lastname,
                phone: user.phone,
                designation: user.designation,
                module: user.module,
                depart: user.depart,
                health_email: user.health_email,
                department_id: user.department_id,
                is_active: user.is_active,
                createdat: user.createdat,
                updatedat: user.updatedat
            }
        });

    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

router.post("/register", validatePasswordMiddleware, async (req, res, next) => {

    try {
        const { username, email, role, password, firstname, lastname, phoneNo, facilityId, module, depart  } = req.body;

        // Validate password policy
        const passwordValidation = validatePassword(password, username);
        if (!passwordValidation.valid) {
            return res.status(400).json({
                status: 'error',
                message: 'Password does not meet security requirements',
                errors: passwordValidation.errors
            });
        }

        const data = {
            username,
            email,
            role,
            firstname,
            lastname,
            phoneNo,
            facilityId,
            module,
            depart,
            password: await bcrypt.hash(password, BCRYPT_ROUNDS),
        };

        const user = await UserModel.create(data);

        // Audit log user registration
        await logDataModification(
            AUDIT_ACTIONS.USER_CREATE,
            'user',
            user.id,
            null,
            { username, email, role },
            req
        );

        if (user) {
            const secretKey = process.env.SECRETKEY || process.env.JWT_SECRET || 'default-secret-key-change-in-production';
            let token = jwt.sign({ id: user.id }, secretKey, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            
            // Security: Never log tokens or sensitive user data in production
            if (process.env.NODE_ENV === 'development') {
                console.log("User registered successfully:", user.username);
            }
            
            //send users details
            return res.status(201).json({ status: 'success', user });
        } else {
            return res.status(409).send("Details are not correct");
        }

    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

router.post("/login", async (req, res, next) => {

    try {

        const { username, password } = req.body;

        const user = await UserModel.findOne({
            where: {
                username: username
            }
        });

        if (user) {
            const isSame = await bcrypt.compare(password, user.password);

            if (isSame) {
                // Check if user is active
                if (!user.is_active) {
                    await logAuthEvent(AUDIT_ACTIONS.LOGIN_FAILURE, req, username, false, 'Account is inactive');
                    return res.status(403).json({ 
                        status: 'error', 
                        message: 'Account is inactive. Please contact administrator.' 
                    });
                }

                const secretKey = process.env.SECRETKEY || process.env.JWT_SECRET || 'default-secret-key-change-in-production';
                let token = jwt.sign({ id: user.id }, secretKey, { expiresIn: 86400 }); // 24 hours
                
                // Audit log successful login
                await logAuthEvent(AUDIT_ACTIONS.LOGIN_SUCCESS, req, username, true);
                
                return res.status(200).json({ status: 'success', accessToken: token, user });
            } else {
                // Audit log failed login
                await logAuthEvent(AUDIT_ACTIONS.LOGIN_FAILURE, req, username, false, 'Invalid password');
                
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'Invalid username or password' 
                });
            }
        } else {
            // Audit log failed login (user not found)
            await logAuthEvent(AUDIT_ACTIONS.LOGIN_FAILURE, req, username, false, 'User not found');
            
            return res.status(401).json({ 
                status: 'error', 
                message: 'Invalid username or password' 
            });
        }

    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

router.get("/me", Auth, async (req, res, next) => {
    try {
        const user = await UserModel.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
});

router.get("/", Auth, authorize('admin'), async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const users = await UserModel.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: users.length,
            users,
        });
    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

router.get("/finance", async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const users = await UserModel.findAll({ limit, offset: skip,  where: { role: "finance" } });

        res.status(200).json({
            status: "success",
            results: users.length,
            users,
        });
    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

router.get("/agents", async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalRecords = await UserModel.count();
        const totalPages = Math.ceil(totalRecords / limit);

        const users = await UserModel.findAll({
            limit, offset: skip,
            where: { role: "agent" }
        });

        res.status(200).json({
            status: "success",
            results: users.length,
            users,
            totalRecords,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

router.patch("/:id", Auth, async (req, res, next) => {
    const password = req.body.password;
    const fields = Object.assign({}, req.body);
    delete fields.password;

    try {
        // Get old user data for audit log
        const oldUser = await UserModel.findByPk(req.params.id);
        if (!oldUser) {
            return res.status(404).json({
                status: "fail",
                message: "User with that ID not found",
            });
        }

        if (password) {
            // Validate password policy if password is being changed
            const passwordValidation = validatePassword(password, oldUser.username);
            if (!passwordValidation.valid) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Password does not meet security requirements',
                    errors: passwordValidation.errors
                });
            }
            fields.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
        }

        const updateData = Object.assign({}, fields, { updatedAt: new Date() });
        const result = await UserModel.update(
            updateData,
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "User with that ID not found",
            });
        }

        const user = await UserModel.findByPk(req.params.id);

        // Audit log user update
        await logDataModification(
            AUDIT_ACTIONS.USER_UPDATE,
            'user',
            user.id,
            { ...oldUser.toJSON(), password: undefined }, // Don't log password
            { ...user.toJSON(), password: undefined },
            req
        );

        res.status(200).json({
            status: "success",
            user,
        });
    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const note = await UserModel.findByPk(req.params.id);

        if (!note) {
            return res.status(404).json({
                status: "fail",
                message: "Note with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                note,
            },
        });
    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

router.delete("/:id", Auth, async (req, res, next) => {
    try {
        // Get user data before deletion for audit log
        const user = await UserModel.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User with that ID not found",
            });
        }

        const result = await UserModel.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "User with that ID not found",
            });
        }

        // Audit log user deletion
        await logDataModification(
            AUDIT_ACTIONS.USER_DELETE,
            'user',
            req.params.id,
            { username: user.username, email: user.email, role: user.role },
            null,
            req
        );

        res.status(204).json();
    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

// Change password endpoint
router.patch("/:id/password", Auth, validatePasswordMiddleware, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.params.id;

        // Find the user
        const user = await UserModel.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "User not found",
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            // Audit log failed password change attempt
            await logAuthEvent(AUDIT_ACTIONS.PASSWORD_CHANGE, req, user.username, false, 'Current password incorrect');
            
            return res.status(400).json({
                status: "fail",
                message: "Current password is incorrect",
            });
        }

        // Validate new password policy
        const passwordValidation = validatePassword(newPassword, user.username);
        if (!passwordValidation.valid) {
            return res.status(400).json({
                status: 'error',
                message: 'New password does not meet security requirements',
                errors: passwordValidation.errors
            });
        }

        // Check if new password is same as current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                status: "fail",
                message: "New password must be different from current password",
            });
        }

        // Hash new password with increased rounds
        const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

        // Update password
        await UserModel.update(
            { password: hashedNewPassword, updatedAt: new Date() },
            { where: { id: userId } }
        );

        // Audit log successful password change
        await logAuthEvent(AUDIT_ACTIONS.PASSWORD_CHANGE, req, user.username, true, 'Password changed successfully');

        res.status(200).json({
            status: "success",
            message: "Password changed successfully",
        });
    } catch (error) {
        // Pass error to error handler middleware
        next(error);
    }
});

module.exports = router;