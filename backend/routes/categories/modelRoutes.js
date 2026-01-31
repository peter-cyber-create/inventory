const express = require("express");
const Model = require("../../models/categories/model.js");
const Brand = require("../../models/categories/brandModel.js");
const Category = require("../../models/categories/categoryModel.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");
const xss = require('xss');

const router = express.Router();

router.post("/", Auth, authorize('admin', 'it'), async (req, res) => {

    try {
        const sanitizedBody = {};
        for (const key in req.body) {
            sanitizedBody[key] = typeof req.body[key] === 'string' ? xss(req.body[key]) : req.body[key];
        }
        const model = await Model.create(sanitizedBody);

        res.status(201).json({
            status: "success",
            model
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 200;
        const skip = (page - 1) * limit;

        const model = await Model.findAll({ limit, offset: skip, include: [{model: Brand}, {model: Category}]});

        res.status(200).json({
            status: "success",
            results: model.length,
            model,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:id", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const sanitizedBody = {};
        for (const key in req.body) {
            sanitizedBody[key] = typeof req.body[key] === 'string' ? xss(req.body[key]) : req.body[key];
        }
        const result = await Model.update(
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

        const model = await Model.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            model
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const model = await Model.findByPk(req.params.id);

        if (!model) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            model,
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
        const result = await Model.destroy({
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