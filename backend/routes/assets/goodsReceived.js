const express = require("express");
const GoodsReceived = require("../../models/assets/goodsReceived.js");
const GoodsItems = require("../../models/assets/ReceivedItems.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");
const { sequelize } = require("../../config/db.js");

const router = express.Router();

router.post("/", Auth, authorize('admin', 'it', 'store'), async (req, res) => {

    try {
        const received = await GoodsReceived.create(req.body);

        // Use transaction for multi-row operation
        const transaction = await sequelize.transaction();
        try {
            const item = req.body.rows.map((row) => ({ ...row, goodsId: received.id }));
            await GoodsItems.bulkCreate(item, { transaction });
            await transaction.commit();

        // Fetch job card items and include them in the response
        const items = await GoodsReceived.findByPk(received.id, {
            include: GoodsItems,
        });

        res.status(201).json({
            status: "success",
            received,
            items
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/", Auth, authorize('admin', 'it', 'store'), async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const assets = await GoodsReceived.findAll({ limit, offset: skip, include: GoodsItems });

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

router.get("/items/:id", Auth, authorize('admin', 'it', 'store'), async (req, res) => {
    try {
        const items = await GoodsItems.findAll({
            where: { goodsId: req.params.id },
        });

        if (!items) {
            return res.status(404).json({
                status: "fail",
                message: "Goods Items with that ID Not found",
            });
        }

        res.status(200).json({
            status: "success",
            items,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.patch("/:id", Auth, authorize('admin', 'it', 'store'), async (req, res) => {
    try {
        const result = await GoodsReceived.update(
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

        const items = await GoodsReceived.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                server,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/:id", Auth, authorize('admin', 'it', 'store'), async (req, res) => {
    try {
        const server = await GoodsReceived.findByPk(req.params.id);

        if (!server) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            server,
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
        const result = await GoodsReceived.destroy({
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