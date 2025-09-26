import express from "express";
import Asset from "../../models/assets/assetsModel.js";
import Audit from "../../models/Logs/auditModel.js";
import Brand from "../../models/categories/brandModel.js";
import Category from "../../models/categories/categoryModel.js";
import Model from "../../models/categories/model.js";
import Type from "../../models/categories/typeModel.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const asset = await Asset.create(req.body);

        const audit = await Audit.create({
            action: "Asset Creation",
            actionedBy: req.body.requestedBy,
            description: "Asset Created In Asset Register",
            assetId: asset.id
        })

        res.status(201).json({
            status: "success",
            asset,
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
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const result = await Asset.update(
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

        const asset = await Asset.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            asset
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
        const asset = await Asset.findByPk(req.params.id,
            {
                include: [{ model: Brand }, { model: Type }, { model: Category }, { model: Model }]
            });

        if (!asset) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            asset,
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
        const result = await Asset.destroy({
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