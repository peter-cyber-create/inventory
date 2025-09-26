import express from "express";
import AssignDriver from "../../models/vehicles/assignDriver.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { driver, vehicleId, remarks, date } = req.body;

        const vehicle = await AssignDriver.create({driver, vehicleId, remarks, date});

        res.status(201).json({
            status: "success",
            vehicle
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
        const limit = req.query.limit || 50;
        const skip = (page - 1) * limit;

        const vehicles = await AssignDriver.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: vehicles.length,
            vehicles,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:vehicleId", async (req, res) => {
    try {
        const result = await AssignDriver.update(
            { ...req.body, updatedAt: Date.now() },
            {
                where: {
                    id: req.params.vehicleId,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Vehicle with that ID not found",
            });
        }

        const vehicle = await AssignDriver.findByPk(req.params.vehicleId);

        res.status(200).json({
            status: "success",
            vehicle
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:vehicleId", async (req, res) => {
    try {
        const vehicle = await AssignDriver.findByPk(req.params.vehicleId);

        if (!vehicle) {
            return res.status(404).json({
                status: "fail",
                message: "Vehicle with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            vehicle,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/:vehicleId", async (req, res) => {
    try {
        const result = await AssignDriver.destroy({
            where: { id: req.params.vehicleId },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Vehicle with that ID not found",
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