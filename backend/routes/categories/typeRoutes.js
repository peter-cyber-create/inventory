const express = require("express");
const Type = require("../../models/vehicles/vType.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");
const xss = require('xss');

const router = express.Router();

router.post("/", Auth, authorize('admin', 'garage'), async (req, res) => {

    try {
        const sanitizedBody = {};
        for (const key in req.body) {
            sanitizedBody[key] = typeof req.body[key] === 'string' ? xss(req.body[key]) : req.body[key];
        }
        const type = await Type.create(sanitizedBody);

        res.status(201).json({
            status: "success",
            type
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const assets = await Type.findAll({ limit, offset: skip, });

        res.status(200).json({
            status: "success",
            results: assets.length,
            assets,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const sanitizedBody = {};
        for (const key in req.body) {
            sanitizedBody[key] = typeof req.body[key] === 'string' ? xss(req.body[key]) : req.body[key];
        }
        const result = await Type.update(
            { ...sanitizedBody, updatedAt: Date.now() },
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

        const type = await Type.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            type
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const type = await Type.findByPk(req.params.id);

        if (!type) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            type,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.delete("/:id", Auth, authorize('admin'), async (req, res) => {
    try {
        const result = await Type.destroy({
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