const express = require("express");
const Audit = require("../../models/Logs/auditModel.js");
const GarageStore = require("../../models/vehicles/garageStore.js");
const PartRequests = require("../../models/vehicles/partRequests.js");
const VehicleParts = require("../../models/vehicles/VehicleParts.js");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const garage = await GarageStore.create(req.body);

        const audit = await Audit.create({
            action: "Vehicle Part Dispatched to Garage Store",
            actionedBy: req.body.requestedBy,
            description: "Garage Store Dispatched Initiated",
            assetId: req.body.partId
        })

        const currentStock = req.body.qtyMainStore - req.body.qtyDispatched

        const updatedAsset = await VehicleParts.update(
            {
                qtyDispatched: req.body.qtyDispatched,
                quantity: currentStock
            },
            { where: { id: req.body.partId } }
        );

        const updatedDispatch = await PartRequests.update(
            { storesDispatched: true },
            { where: { id: req.body.id } }
        );

        res.status(201).json({
            status: "success",
            garage,
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

        const parts = await GarageStore.findAll({
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

        const parts = await GarageStore.findAll({
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
        const result = await GarageStore.update(
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

        const garage = await GarageStore.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            garage
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
        const garage = await GarageStore.findByPk(req.params.id);

        if (!garage) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            garage,
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
        const result = await GarageStore.destroy({
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