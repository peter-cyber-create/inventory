const express = require("express");
const Audit = require("../../models/Logs/auditModel.js");
const Issue = require("../../models/assets/issueModel.js");
const Transfer = require("../../models/assets/tranferModel.js");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const tranfer = await Transfer.create(req.body);

        const audit = await Audit.create({
            action: "Change Of Asset Ownership",
            actionedBy: req.body.user,
            description: "Asset Changed Ownership To Different User",
            assetId: req.body.assetId
        })

        const updateIssue = await Issue.update(
            { issuedTo: req.body.user,
                department: req.body.department,
                title: req.body.title
            },
            { where: { assetId: req.body.assetId } }
        );

        res.status(201).json({
            status: "success",
            tranfer,
            audit,
            updateIssue
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

        const transfers = await Transfer.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: transfers.length,
            transfers,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:transferId", async (req, res) => {
    try {
        const result = await Transfer.update(
            { ...req.body, updatedAt: Date.now() },
            {
                where: {
                    id: req.params.transferId,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Tranfer with that ID not found",
            });
        }

        const tranfer = await Transfer.findByPk(req.params.transferId);

        res.status(200).json({
            status: "success",
            tranfer
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:transferId", async (req, res) => {
    try {
        const tranfer = await Transfer.findByPk(req.params.transferId);

        if (!tranfer) {
            return res.status(404).json({
                status: "fail",
                message: "Tranfer with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            tranfer,
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
        const transfer = await Transfer.findAll({
            where: {
                assetId: req.params.id
            }
        });

        if (!transfer || transfer.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Asset with that assetId not found",
            });
        }

        res.status(200).json({
            status: "success",
            transfer,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/:transferId", async (req, res) => {
    try {
        const result = await Transfer.destroy({
            where: { id: req.params.transferId },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Tranfer with that ID not found",
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