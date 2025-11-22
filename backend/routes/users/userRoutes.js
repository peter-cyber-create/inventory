const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require("../../middleware/auth.js");
const UserModel = require("../../models/users/userModel.js");

const router = express.Router();

// Create new user (admin endpoint)
router.post("/", async (req, res) => {
    try {
        const { username, email, role, password, firstname, lastname, phone, designation, module, depart, health_email, department_id, is_active } = req.body;

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
            password: await bcrypt.hash(password, 10),
        };

        const user = await UserModel.create(data);

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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.post("/register", async (req, res) => {

    try {
        const { username, email, role, password, firstname, lastname, phoneNo, facilityId, module, depart  } = req.body;

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
            password: await bcrypt.hash(password, 10),
        };

        const user = await UserModel.create(data);

        if (user) {
            let token = jwt.sign({ id: user.id }, process.env.SECRETKEY, {
                expiresIn: 1 * 24 * 60 * 60 * 1000,
            });

            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            console.log("user", JSON.stringify(user, null, 2));
            console.log(token);
            //send users details
            return res.status(201).json({ status: 'success', user });
        } else {
            return res.status(409).send("Details are not correct");
        }

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.post("/login", async (req, res) => {

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
                let token = jwt.sign({ id: user.id }, process.env.SECRETKEY, { expiresIn: 86400 }); // 24 hours
                return res.status(200).json({ status: 'success', accessToken: token, user });
            } else {
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'Invalid username or password' 
                });
            }
        } else {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Invalid username or password' 
            });
        }

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/me", Auth, async (req, res) => {
    const user = await UserModel.findByPk(req.user.id)
    try {
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.json(error.message);
    }
});

router.get("/", async (req, res) => {
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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/finance", async (req, res) => {
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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/agents", async (req, res) => {
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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:id", async (req, res) => {
    const password = req.body.password;
    const fields = Object.assign({}, req.body);
    delete fields.password;

    try {
        if (password) {
            fields.password = await bcrypt.hash(password, 10);
        }

        const updateData = Object.assign({}, fields, { updatedAt: Date.now() });
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
                message: "Note with that ID not found",
            });
        }

        const user = await UserModel.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            user,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
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

        res.status(204).json();
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

// Change password endpoint
router.patch("/:id/password", async (req, res) => {
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
            return res.status(400).json({
                status: "fail",
                message: "Current password is incorrect",
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await UserModel.update(
            { password: hashedNewPassword },
            { where: { id: userId } }
        );

        res.status(200).json({
            status: "success",
            message: "Password changed successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

module.exports = router;