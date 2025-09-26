import express from "express";
import Dispatch from "../../models/assets/dispatchModel.js";
import Asset from "../../models/assets/assetsModel.js";
import Audit from "../../models/Logs/auditModel.js";
import Brand from "../../models/categories/brandModel.js";
import Category from "../../models/categories/categoryModel.js";
import Model from "../../models/categories/model.js";
import Type from "../../models/categories/typeModel.js";

const router = express.Router();

router.post("/stores", async (req, res) => {

    try {
        const requisition = await Dispatch.create(req.body);

        const audit = await Audit.create({
            action: "Dispatched From Stores",
            actionedBy: req.body.requestedBy,
            description: "Asset Dispacthed From Stores",
            assetId: req.body.assetId
        })

        const updatedAsset = await Asset.update(
            { status: "Dispatched From Stores", storesdispatch: true },
            { where: { id: req.body.assetId } }
        );

        res.status(201).json({
            status: "success",
            requisition,
            audit,
            updatedAsset
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

        const assets = await Dispatch.findAll({ 
            where: { isIssued: false },
            limit, offset: skip, include: [{ model: Asset}] });

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

router.get("/assets", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const assets = await Asset.findAll({
            where: { requisition: false },
            limit,
            offset: skip,
            include: [
                { model: Brand },
                { model: Category },
                { model: Model },
                {
                    model: Type, where: {
                        typeName: "ICT Equipment"
                    }
                }
            ]
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

router.get("/stores/:id", async (req, res) => {
    try {
        const asset = await Dispatch.findByPk(req.params.id, { include: [{ model: Asset }] });

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

router.patch("/:id", async (req, res) => {
    try {
        const result = await Dispatch.update(
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

        const requisition = await Dispatch.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            requisition
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
        const result = await Dispatch.destroy({
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