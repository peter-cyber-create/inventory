const express = require("express");
import { sequelize, QueryTypes } from '../../config/db.js';
const JobCard = require("../../models/vehicles/jobCardModel.js");
const PartsUsed = require("../../models/vehicles/partsUsed.js");
const SpareParts = require("../../models/vehicles/vSpareParts.js");
const Vehicle = require("../../models/vehicles/vehicleModel.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");

const router = express.Router();

router.post("/", Auth, authorize('admin', 'garage'), async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        // Create the job card inside the transaction
        const newJobCard = await JobCard.create(req.body, { transaction });

        // Loop through the parts and process each one
        const partsPromises = req.body.rows.map(async (row) => {
            const part = { ...row, jobCardId: newJobCard.id };

            if (process.env.NODE_ENV === 'development') {
                console.log("part:::: ===>", part);
            }
            
            // Create the PartsUsed record
            const partsUsed = await PartsUsed.create(part, { transaction });
            
            // Find the spare part and update its quantity
            const sparepart = await SpareParts.findOne({ where: { id: part.partId }, transaction });
            if (!sparepart) {
                throw new Error(`Spare part with ID ${part.partId} not found`);
            }

            // Check if there's enough quantity available
            if (sparepart.qty < partsUsed.qtyUsed) {
                throw new Error(`Insufficient quantity for part ID ${part.partId}`);
            }

            // Update the spare part's quantity
            await sparepart.update({ qty: sparepart.qty - partsUsed.qtyUsed }, { transaction });
        });

        // Execute all promises (part updates)
        await Promise.all(partsPromises);

        // Commit the transaction
        await transaction.commit();

        // Send success response
        res.status(201).json({
            status: "success",
            newJobCard,
        });
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 50;
        const skip = (page - 1) * limit;

        const job = await JobCard.findAll({
            limit, offset: skip,
            include: [{ model: Vehicle }]
        });

        res.status(200).json({
            status: "success",
            results: job.length,
            job,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/parts", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const job = await PartsUsed.findAll({
            limit, offset: skip,
        });

        res.status(200).json({
            status: "success",
            results: job.length,
            job,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/parts/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 50;
        const skip = (page - 1) * limit;

        const parts = await PartsUsed.findAll({
            limit, offset: skip,
            where: { jobCardId: req.params.id }
        });

        res.status(200).json({
            status: "success",
            results: parts.length,
            parts,
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
        const result = await JobCard.update(
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

        const job = await JobCard.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                job,
            },
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
        const job = await JobCard.findByPk(req.params.id);

        if (!job) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            job,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/vehicle/:id", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const job = await JobCard.findAll({ where: { vehicleId: req.params.id } });

        if (!job) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            job,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/history", Auth, authorize('admin', 'garage'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const query = `
            SELECT
                j.id,
                j."licensePlate",
                j.repair,
                j."createdAt",
                p.partname,
                p.partno,
                p.specification,
                p."qtyUsed"
            FROM public.jobcards j
            INNER JOIN public.partuseds p ON p."jobCardId" = j.id
        `
        const job = await sequelize.query(query, { type: QueryTypes.SELECT });

        res.status(200).json({
            status: "success",
            results: job.length,
            job,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});


module.exports = router;