import express from "express";
import VehicleParts from "../../models/vehicles/VehicleParts.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const parts = await VehicleParts.create(req.body);

        res.status(201).json({
            status: "success",
            parts
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

        const parts = await VehicleParts.findAll({ limit, offset: skip });

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
        const result = await VehicleParts.update(
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
                message: "VehicleParts with that ID not found",
            });
        }

        const parts = await VehicleParts.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            parts
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
        const parts = await VehicleParts.findByPk(req.params.id);

        if (!parts) {
            return res.status(404).json({
                status: "fail",
                message: "VehicleParts with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            parts,
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
        const parts = await VehicleParts.findAll({
            where: {
                assetId: req.params.id
            }
        });

        if (!parts || parts.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "VehicleParts with that assetId not found",
            });
        }

        res.status(200).json({
            status: "success",
            parts,
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
        const result = await VehicleParts.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "VehicleParts with that ID not found",
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