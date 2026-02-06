const express = require("express");
const Audit = require("../../models/Logs/auditModel.js");
const Maintenance = require("../../models/assets/MaintenanceModel.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");

const router = express.Router();

router.post("/", Auth, authorize('admin', 'it'), async (req, res) => {

    try {
        const { servicedBy, servicedOn, nextService, taskName, description, assetId } = req.body;

        if (!servicedBy || !servicedOn || !nextService || !taskName || !description || !assetId) {
            return res.status(400).json({
                status: "error",
                message: "All maintenance fields are required: Task Name, Serviced By, Serviced On, Next Service Date, Description and Asset reference."
            });
        }

        const maintenance = await Maintenance.create({
            servicedBy,
            servicedOn,
            nextService,
            taskName,
            description,
            assetId
        });

        // Try to write an audit record, but do NOT fail the main request if audits table is missing
        let audit = null;
        try {
            audit = await Audit.create({
                action: "Preventive Maintenance",
                actionedBy: req.body.user || 'system',
                description: "Asset Preventive Maintenance Done",
                assetId: assetId
            });
        } catch (auditError) {
            // Log and continue – maintenance record is more important than audit logging
            console.error('Audit log creation failed for maintenance:', auditError.message);
        }

        res.status(201).json({
            status: "success",
            maintenance,
            audit
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const message = error.errors?.map(e => e.message).join(', ') || 'Validation error while saving maintenance record.';
            return res.status(400).json({
                status: "error",
                message
            });
        }

        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const maintenance = await Maintenance.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: maintenance.length,
            maintenance,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:id", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const result = await Maintenance.update(
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
                message: "Maintenance with that ID not found",
            });
        }

        const maintenance = await Maintenance.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            maintenance
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const maintenance = await Maintenance.findByPk(req.params.id);

        if (!maintenance) {
            return res.status(404).json({
                status: "fail",
                message: "Maintenance with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            maintenance,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/asset/:id", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const maintenance = await Maintenance.findAll({
            where: {
                assetId: req.params.id
            }
        });

        if (!maintenance || maintenance.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Maintenance with that assetId not found",
            });
        }

        res.status(200).json({
            status: "success",
            maintenance,
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
        const result = await Maintenance.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Maintenance with that ID not found",
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


module.exports = router;