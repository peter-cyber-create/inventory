import express from "express";
import GarageReceive from "../../models/vehicles/GarageReceive.js";
import Vehicle from "../../models/vehicles/vehicleModel.js";
import Audit from "../../models/Logs/auditModel.js";
import Service from "../../models/vehicles/vServiceRequest.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const garage = await GarageReceive.create(req.body);

        const audit = await Audit.create({
            action: "Vehicle Received In Garage",
            actionedBy: req.body.requestedBy,
            description: "Vehicle Received In Garage",
            assetId: req.body.vehicleId
        })

        const updatedRequest = await Service.update(
            { isRequest: false },
            { where: { vehicleId: req.body.vehicleId } }
        );

        res.status(201).json({
            status: "success",
            garage,
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

        const garage = await GarageReceive.findAll({
            include: { model: Vehicle }
        });

        res.status(200).json({
            status: "success",
            results: garage.length,
            garage,
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
        const result = await GarageReceive.update(
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

        const garage = await GarageReceive.findByPk(req.params.id);

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
        const garage = await GarageReceive.findOne({  where: {
            id: req.params.id,
        },include: { model: Vehicle }});

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
        const result = await GarageReceive.destroy({
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


export default router;