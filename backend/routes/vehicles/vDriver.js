const express = require("express");
const VDriver = require("../../models/vehicles/vDrivers.js");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const driver = await VDriver.create(req.body);

        res.status(201).json({
            status: "success",
            driver
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

        const driver = await VDriver.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: driver.length,
            driver,
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
        const result = await VDriver.update(
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
                message: "VDriver with that ID not found",
            });
        }

        const driver = await VDriver.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            driver
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
        const driver = await VDriver.findByPk(req.params.id);

        if (!driver) {
            return res.status(404).json({
                status: "fail",
                message: "VDriver with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            driver,
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
        const result = await VDriver.destroy({
            where: { id: req.params.id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "VDriver with that ID not found",
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