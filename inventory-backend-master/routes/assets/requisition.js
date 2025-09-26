import express from "express";
import Requisition from "../../models/assets/requisition.js";
import Asset from "../../models/assets/assetsModel.js";
import Audit from "../../models/Logs/auditModel.js";
import Brand from "../../models/categories/brandModel.js";
import Category from "../../models/categories/categoryModel.js";
import Model from "../../models/categories/model.js";
import Type from "../../models/categories/typeModel.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const requisition = await Requisition.create(req.body);

        const audit = await Audit.create({
            action: "Stores Requisition",
            actionedBy: req.body.requestedBy,
            description: "Asset Requested From Stores",
            assetId: req.body.assetId
        })

        const updatedAsset = await Asset.update(
            { requisition: true },
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

router.get("/it/assets", async (req, res) => {
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
                { model: Model }
                // {
                //     model: Type, where: {
                //         typeName: "ICT Equipment"
                //     }
                // }
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

router.get("/stores", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const assets = await Asset.findAll({
            where: { requisition: true, storesdispatch: false },
            limit,
            offset: skip,
            include: [
                { model: Brand },
                { model: Category },
                { model: Model },
            ]
        });

        console.log(assets)

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

router.get("/asset/:id", async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id, { include: [{ model: Model }] });

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

export default router;