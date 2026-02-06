const express = require("express");
const ServerModal = require("../../models/server/serverModel.js");

const router = express.Router();

// Basic validation helper
const validateServerPayload = (body) => {
    const requiredFields = [
        "serialNo",
        "engranvedNo",
        "serverName",
        "productNo",
        "brand",
        "IP",
        "purchaseDate",
        "warrantly",
        "expiryDate",
        "memory",
        "processor",
        "hypervisor",
        "hardDisk"
    ];

    const missing = requiredFields.filter((field) => !body[field] || String(body[field]).trim() === "");
    return missing;
};

// Create physical or generic server
router.post("/", async (req, res) => {
    try {
        const missing = validateServerPayload(req.body);
        if (missing.length > 0) {
            return res.status(400).json({
                status: "error",
                message: `Missing required fields: ${missing.join(", ")}`
            });
        }

        const server = await ServerModal.create(req.body);

        res.status(201).json({
            status: "success",
            server,
        });
    } catch (error) {
        // Check if the error is due to missing table
        if (error.message && error.message.includes('relation "servers" does not exist')) {
            return res.status(503).json({
                status: "error",
                message: "Server database table not found. Please contact system administrator to create the 'servers' table in the database.",
            });
        }
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

// Alias route for virtual servers – currently same model,
// separated so existing frontend /servers/virtual keeps working.
router.post("/virtual", async (req, res) => {
    try {
        const missing = validateServerPayload(req.body);
        if (missing.length > 0) {
            return res.status(400).json({
                status: "error",
                message: `Missing required fields: ${missing.join(", ")}`
            });
        }

        const server = await ServerModal.create(req.body);

        res.status(201).json({
            status: "success",
            server,
        });
    } catch (error) {
        // Check if the error is due to missing table
        if (error.message && error.message.includes('relation "servers" does not exist')) {
            return res.status(503).json({
                status: "error",
                message: "Server database table not found. Please contact system administrator to create the 'servers' table in the database.",
            });
        }
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

// List physical/generic servers
router.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const servers = await ServerModal.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: servers.length,
            servers,
        });
    } catch (error) {
        // Check if the error is due to missing table
        if (error.message && error.message.includes('relation "servers" does not exist')) {
            return res.status(503).json({
                status: "error",
                message: "Server database table not found. Please contact system administrator to create the 'servers' table in the database.",
            });
        }
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

// Alias list for virtual servers (same data set for now)
router.get("/virtual", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const servers = await ServerModal.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: servers.length,
            servers,
        });
    } catch (error) {
        // Check if the error is due to missing table
        if (error.message && error.message.includes('relation "servers" does not exist')) {
            return res.status(503).json({
                status: "error",
                message: "Server database table not found. Please contact system administrator to create the 'servers' table in the database.",
            });
        }
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const result = await ServerModal.update(
            { ...req.body, updatedAt: Date.now() },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        const server = await ServerModal.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                server,
            },
        });
    } catch (error) {
        // Check if the error is due to missing table
        if (error.message && error.message.includes('relation "servers" does not exist')) {
            return res.status(503).json({
                status: "error",
                message: "Server database table not found. Please contact system administrator to create the 'servers' table in the database.",
            });
        }
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const server = await ServerModal.findByPk(req.params.id);

        if (!server) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            server,
        });
    } catch (error) {
        // Check if the error is due to missing table
        if (error.message && error.message.includes('relation "servers" does not exist')) {
            return res.status(503).json({
                status: "error",
                message: "Server database table not found. Please contact system administrator to create the 'servers' table in the database.",
            });
        }
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await ServerModal.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(204).json();
    } catch (error) {
        // Check if the error is due to missing table
        if (error.message && error.message.includes('relation "servers" does not exist')) {
            return res.status(503).json({
                status: "error",
                message: "Server database table not found. Please contact system administrator to create the 'servers' table in the database.",
            });
        }
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});


module.exports = router;