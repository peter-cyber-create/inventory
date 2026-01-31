const express = require("express");
const Issue = require("../../models/assets/issueModel.js");
const Asset = require("../../models/assets/assetsModel.js");
const Audit = require("../../models/Logs/auditModel.js");
const Dispatch = require("../../models/assets/dispatchModel.js");
const Brand = require("../../models/categories/brandModel.js");
const Category = require("../../models/categories/categoryModel.js");
const Model = require("../../models/categories/model.js");
const Staff = require("../../models/categories/staffModel.js");
const Departs = require("../../models/categories/departments.js");
const Division = require("../../models/categories/divisions.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");

const router = express.Router();

router.post("/ict", Auth, authorize('admin', 'it'), async (req, res) => {

    try {
        const issue = await Issue.create(req.body);

        const audit = await Audit.create({
            action: "Issue Asset",
            actionedBy: req.body.requestedBy,
            description: "Asset Issued to end User",
            assetId: req.body.assetId
        })

        const updatedAsset = await Asset.update(
            { status: "Issued To User", itissue: true },
            { where: { id: req.body.assetId } }
        );

        const updatedDispatch = await Dispatch.update(
            { isIssued: true },
            { where: { assetId: req.body.assetId } }
        );

        res.status(201).json({
            status: "success",
            issue,
            audit,
            updatedAsset,
            updatedDispatch


        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/user/:id", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 50;
        const skip = (page - 1) * limit;

        const asset = await Issue.findOne({
            where: {
                assetId: req.params.id
            },
            include: [
                {
                    model: Staff,
                    include: [
                        {
                            model: Departs,
                            attributes: ["id", "name"], // Include only necessary fields
                        },
                        {
                            model: Division,
                            attributes: ["id", "name"], // Include only necessary fields
                        },
                    ],
                },
            ],
        });

        res.status(200).json({
            status: "success",
            results: asset.length,
            asset,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/users", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const assets = await Issue.findAll({
            limit,
            offset: skip,
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

router.get("/inventory", Auth, authorize('admin', 'it'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 30;
        const skip = (page - 1) * limit;

        const assets = await Asset.findAll({
            where: { itissue: true },
            limit,
            offset: skip,
            include: [{ model: Brand }, { model: Category }, { model: Model },
                {
                    model: Staff,
                    include: [
                        {
                            model: Departs,
                            attributes: ["id", "name"], // Include only necessary fields
                        },
                        {
                            model: Division,
                            attributes: ["id", "name"], // Include only necessary fields
                        },
                    ],
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
        const asset = await Issue.findByPk(req.params.id, { include: [{ model: Asset }] });

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

module.exports = router;