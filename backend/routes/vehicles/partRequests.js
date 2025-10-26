const express = require("express");
const PartRequest = require("../../models/vehicles/partRequests.js");
const Audit = require("../../models/Logs/auditModel.js");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const part = await PartRequest.create(req.body);

        // const audit = await Audit.create({
        //     action: "Vehicle Part Request Requisition",
        //     actionedBy: req.body.requestedBy,
        //     description: "Vehicle PartRequest Requisition Initiated",
        //     assetId: req.body.assetId
        // })

        res.status(201).json({
            status: "success",
            part,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 50;
        const skip = (page - 1) * limit;

        const parts = await PartRequest.findAll({
            limit,
            offset: skip,
        });

        res.status(200).json({
            status: "success",
            results: parts.length,
            parts,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/stores", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const parts = await PartRequest.findAll({
            where: { storesDispatched: false },
            limit,
            offset: skip,
        });

        res.status(200).json({
            status: "success",
            results: parts.length,
            parts,
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
        const result = await PartRequest.update(
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

    const part = await PartRequest.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            part
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
        const part = await PartRequest.findByPk(req.params.id);

        if (!part) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            part,
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
        const result = await PartRequest.destroy({
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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});


module.exports = router;