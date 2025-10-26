const express = require("express");
const Audit = require("../../models/Logs/auditModel.js");
const Maintenance = require("../../models/assets/MaintenanceModel.js");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const maintenance = await Maintenance.create(req.body);

        const audit = await Audit.create({
            action: "Preventive Maintenance",
            actionedBy: req.body.user,
            description: "Asset Preventive Maintenance Done",
            assetId: req.body.assetId
        })

        res.status(201).json({
            status: "success",
            maintenance,
            audit
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/", async (req, res) => {
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

router.patch("/:id", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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

router.get("/asset/:id", async (req, res) => {
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