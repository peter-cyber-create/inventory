import express from "express";
import Audit from "../../models/Logs/auditModel.js";
import Asset from "../../models/assets/assetsModel.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const audit = await Audit.create(req.body);

        res.status(201).json({
            status: "success",
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

        const assets = await Audit.findAll({ limit, offset: skip, include: [{ model: Asset }] });

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
        const result = await Audit.update(
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

        const audit = await Audit.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            audit
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
        const audit = await Audit.findAll({where: { assetId: req.params.id }});

        if (!audit) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            audit,
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
        const result = await Audit.destroy({
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