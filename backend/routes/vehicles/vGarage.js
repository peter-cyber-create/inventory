const express = require("express");
const VGarage = require("../../models/vehicles/vGarage.js");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const garage = await VGarage.create(req.body);

        res.status(201).json({
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

router.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 50;
        const skip = (page - 1) * limit;

        const garage = await VGarage.findAll({ limit, offset: skip });

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
        const result = await VGarage.update(
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
                message: "VGarage with that ID not found",
            });
        }

        const garage = await VGarage.findByPk(req.params.id);

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
        const garage = await VGarage.findByPk(req.params.id);

        if (!garage) {
            return res.status(404).json({
                status: "fail",
                message: "VGarage with that ID not found",
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
        const result = await VGarage.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "VGarage with that ID not found",
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