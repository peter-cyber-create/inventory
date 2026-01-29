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

        // Handle form data format: if rows array exists, process multiple assets
        if (req.body.rows && Array.isArray(req.body.rows)) {
            const createdAssets = [];
            const errors = [];

            // Get default IDs for fallback
            const [defaultType] = await Type.findAll({ limit: 1 });
            const [defaultCategory] = await Category.findAll({ limit: 1 });
            const [defaultBrand] = await Brand.findAll({ limit: 1 });
            const [defaultModel] = await Model.findAll({ limit: 1 });
            const Staff = require("../../models/categories/staffModel.js");
            const [defaultStaff] = await Staff.findAll({ limit: 1 });

            for (const row of req.body.rows) {
                try {
                    // Map form data to asset model format
                    const assetData = {
                        description: row.asset || row.description || 'ICT Asset',
                        serialNo: row.serialNo || null,
                        engravedNo: row.engravedNo || null,
                        funding: row.funding || null,
                        funder: row.funding || null,
                        status: 'InStores',
                        // Map category/model names to IDs, or use defaults
                        categoryId: row.categoryId || defaultCategory?.id || null,
                        modelId: row.modelId || defaultModel?.id || null,
                        typeId: defaultType?.id || null,
                        brandId: defaultBrand?.id || null,
                        staffId: defaultStaff?.id || null
                    };

                    const asset = await Asset.create(assetData);
                    createdAssets.push(asset);

                    // Create audit log
                    await Audit.create({
                        action: "Asset Creation",
                        actionedBy: req.body.user || req.body.requestedBy || null,
                        description: "Asset Created In Asset Register",
                        assetId: asset.id
                    });
                } catch (error) {
                    errors.push({ row, error: error.message });
                }
            }

            if (createdAssets.length > 0) {
                return res.status(201).json({
                    status: "success",
                    message: `Successfully created ${createdAssets.length} asset(s)`,
                    assets: createdAssets,
                    errors: errors.length > 0 ? errors : undefined
                });
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "Failed to create any assets",
                    errors: errors
                });
            }
        }

        // Handle single asset creation (legacy format)
        // Map form fields to model fields
        const assetData = {
            ...req.body,
            description: req.body.description || req.body.asset || 'ICT Asset',
            // Ensure foreign keys are set or use defaults
            typeId: req.body.typeId || null,
            categoryId: req.body.categoryId || null,
            brandId: req.body.brandId || null,
            modelId: req.body.modelId || null,
            staffId: req.body.staffId || null
        };

        const asset = await Asset.create(assetData);

        const audit = await Audit.create({
            action: "Asset Creation",
            actionedBy: req.body.requestedBy || req.body.user || null,
            description: "Asset Created In Asset Register",
            assetId: asset.id
        });

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