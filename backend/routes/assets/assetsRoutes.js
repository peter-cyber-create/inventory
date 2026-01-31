const express = require("express");
const Asset = require("../../models/assets/assetsModel.js");
const Audit = require("../../models/Logs/auditModel.js");
const Brand = require("../../models/categories/brandModel.js");
const Category = require("../../models/categories/categoryModel.js");
const Model = require("../../models/categories/model.js");
const Type = require("../../models/categories/typeModel.js");
const Staff = require("../../models/categories/staffModel.js");
const { sequelize } = require("../../config/db.js");
const Auth = require("../../middleware/auth.js");

const router = express.Router();

// Input sanitization helper
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return input.trim().replace(/[<>]/g, '');
    }
    if (Array.isArray(input)) {
        return input.map(item => sanitizeInput(item));
    }
    if (input && typeof input === 'object') {
        const sanitized = {};
        for (const key in input) {
            sanitized[key] = sanitizeInput(input[key]);
        }
        return sanitized;
    }
    return input;
};

router.post("/", Auth, async (req, res, next) => {
    try {
        // Log only in development
        if (process.env.NODE_ENV === 'development') {
            console.log('📥 Asset creation request received:', JSON.stringify(req.body, null, 2));
        }
        
        // Sanitize input
        const sanitizedBody = sanitizeInput(req.body);
        
        // Basic input validation
        if (!sanitizedBody || Object.keys(sanitizedBody).length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Request body is required",
            });
        }

        // Handle form data format: if rows array exists, process multiple assets
        if (sanitizedBody.rows && Array.isArray(sanitizedBody.rows)) {
            if (process.env.NODE_ENV === 'development') {
                console.log(`📦 Processing ${sanitizedBody.rows.length} asset(s) from rows array`);
            }
            const createdAssets = [];
            const errors = [];

            // Get default IDs for fallback (handle errors gracefully)
            let defaultType, defaultCategory, defaultBrand, defaultModel, defaultStaff;
            
            try {
                const types = await Type.findAll({ limit: 1 });
                defaultType = types && types.length > 0 ? types[0] : null;
            } catch (e) { 
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Could not fetch default type:', e.message);
                }
                defaultType = null; 
            }
            
            try {
                const categories = await Category.findAll({ limit: 1 });
                defaultCategory = categories && categories.length > 0 ? categories[0] : null;
            } catch (e) { 
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Could not fetch default category:', e.message);
                }
                defaultCategory = null; 
            }
            
            try {
                const brands = await Brand.findAll({ limit: 1 });
                defaultBrand = brands && brands.length > 0 ? brands[0] : null;
            } catch (e) { 
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Could not fetch default brand:', e.message);
                }
                defaultBrand = null; 
            }
            
            try {
                const models = await Model.findAll({ limit: 1 });
                defaultModel = models && models.length > 0 ? models[0] : null;
            } catch (e) { 
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Could not fetch default model:', e.message);
                }
                defaultModel = null; 
            }
            
            try {
                // Use raw query to avoid Sequelize pluralization issues
                const { QueryTypes } = require('sequelize');
                const staffResults = await sequelize.query('SELECT id FROM staff LIMIT 1', { type: QueryTypes.SELECT });
                defaultStaff = staffResults && staffResults.length > 0 ? { id: staffResults[0].id } : null;
            } catch (e) { 
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Could not fetch default staff:', e.message);
                }
                defaultStaff = null; 
            }

            for (const row of sanitizedBody.rows) {
                try {
                    // Try to find model by name if modelId not provided
                    let modelId = row.modelId;
                    if (!modelId && row.model) {
                        try {
                            const foundModel = await Model.findOne({ where: { name: row.model }, limit: 1 });
                            if (foundModel) modelId = foundModel.id;
                        } catch (e) { /* ignore */ }
                    }
                    
                    // Try to find category by name if categoryId not provided
                    let categoryId = row.categoryId;
                    if (!categoryId && row.category) {
                        try {
                            const foundCategory = await Category.findOne({ where: { name: row.category }, limit: 1 });
                            if (foundCategory) categoryId = foundCategory.id;
                        } catch (e) { /* ignore */ }
                    }

                    // Map form data to asset model format - ensure description is never empty
                    const description = (row.asset || row.description || 'ICT Asset').trim();
                    if (!description || description === '') {
                        throw new Error('Asset description is required');
                    }

                    const assetData = {
                        description: description,
                        serialNo: (row.serialNo || '').trim() || null,
                        engravedNo: (row.engravedNo || '').trim() || null,
                        funding: (row.funding || '').trim() || null,
                        funder: (row.funding || '').trim() || null,
                        status: 'InStores',
                        // Use found IDs or defaults - ensure we always have values
                        categoryId: categoryId || (defaultCategory ? defaultCategory.id : null),
                        modelId: modelId || (defaultModel ? defaultModel.id : null),
                        typeId: (defaultType ? defaultType.id : null),
                        brandId: (defaultBrand ? defaultBrand.id : null),
                        staffId: (defaultStaff ? defaultStaff.id : null)
                    };

                    // Validate required fields before creating
                    if (!assetData.description) {
                        throw new Error('Asset description is required');
                    }

                    if (process.env.NODE_ENV === 'development') {
                        console.log('📝 Creating asset with data:', JSON.stringify(assetData, null, 2));
                    }
                    const asset = await Asset.create(assetData);
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Asset created successfully:', asset.id);
                    }
                    createdAssets.push(asset);

                    // Create audit log
                    await Audit.create({
                        action: "Asset Creation",
                        actionedBy: req.user?.id || req.body.user || req.body.requestedBy || null,
                        description: "Asset Created In Asset Register",
                        assetId: asset.id
                    });
                } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('❌ Error creating asset:', error);
                        console.error('   Error name:', error.name);
                        console.error('   Error message:', error.message);
                        if (error.errors) {
                            console.error('   Validation errors:', error.errors.map(e => `${e.path}: ${e.message}`));
                        }
                    }
                    errors.push({ 
                        row, 
                        error: error.message,
                        details: error.errors ? error.errors.map(e => `${e.path}: ${e.message}`).join(', ') : undefined
                    });
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
                // Return first error message for user-friendly display
                const firstError = errors.length > 0 ? errors[0] : null;
                const errorMessage = firstError 
                    ? (firstError.details || firstError.error || "Failed to create asset")
                    : "Failed to create any assets";
                
                return res.status(400).json({
                    status: "error",
                    message: errorMessage,
                    errors: errors
                });
            }
        }

        // Handle single asset creation (legacy format)
        // Map form fields to model fields
        const assetData = {
            ...sanitizedBody,
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
            actionedBy: req.user?.id || req.body.requestedBy || req.body.user || null,
            description: "Asset Created In Asset Register",
            assetId: asset.id
        });

        res.status(201).json({
            status: "success",
            asset,
            audit
        });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Asset creation error:', error);
        }
        // Return more detailed error in development
        if (process.env.NODE_ENV === 'development') {
            return res.status(400).json({
                status: "error",
                message: error.message || "Failed to create asset",
                details: error.errors ? error.errors.map(e => e.message) : undefined,
                stack: error.stack
            });
        }
        next(error);
    }
});

router.get("/", Auth, async (req, res, next) => {
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

router.patch("/:id", Auth, async (req, res, next) => {
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

router.get("/:id", Auth, async (req, res, next) => {
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

router.delete("/:id", Auth, async (req, res, next) => {
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