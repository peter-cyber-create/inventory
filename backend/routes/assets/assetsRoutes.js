const express = require("express");
const Asset = require("../../models/assets/assetsModel.js");
const Audit = require("../../models/Logs/auditModel.js");
const Brand = require("../../models/categories/brandModel.js");
const Category = require("../../models/categories/categoryModel.js");
const Model = require("../../models/categories/model.js");
const Type = require("../../models/categories/typeModel.js");

const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        // Basic input validation
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Request body is required",
            });
        }

        const asset = await Asset.create(req.body);

        const audit = await Audit.create({
            action: "Asset Creation",
            actionedBy: req.body.requestedBy || null,
            description: "Asset Created In Asset Register",
            assetId: asset.id
        })

        res.status(201).json({
            status: "success",
            asset,
            audit
        });
    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const assets = await Asset.findAll({
            limit,
            offset: skip,
            include: [{ model: Brand }, { model: Type }, { model: Category }, { model: Model }]
        });

        res.status(200).json({
            status: "success",
            results: assets.length,
            assets,
        });
    } catch (error) {
        next(error);
    }
});

router.patch("/:id", async (req, res, next) => {
    try {
        // Validate ID parameter
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid asset ID",
            });
        }

        // Remove id from body to prevent overwriting
        const updateData = { ...req.body };
        delete updateData.id;

        const result = await Asset.update(
            { ...updateData, updatedAt: Date.now() },
            {
                where: {
                    id: id,
                },
            }
        );

        if (result[0] === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Asset with that ID not found",
            });
        }

        const asset = await Asset.findByPk(id, {
            include: [{ model: Brand }, { model: Type }, { model: Category }, { model: Model }]
        });

        res.status(200).json({
            status: "success",
            asset
        });
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                status: "error",
                message: "Validation error",
                errors: error.errors.map(err => err.message)
            });
        }

        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid asset ID",
            });
        }

        const asset = await Asset.findByPk(id, {
            include: [{ model: Brand }, { model: Type }, { model: Category }, { model: Model }]
        });

        if (!asset) {
            return res.status(404).json({
                status: "fail",
                message: "Asset with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            asset,
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid asset ID",
            });
        }

        const result = await Asset.destroy({
            where: { id: id },
            force: true,
        });

        if (result === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Asset with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Asset deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});


module.exports = router;