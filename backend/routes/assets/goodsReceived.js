const express = require("express");
const GoodsReceived = require("../../models/assets/goodsReceived.js");
const GoodsItems = require("../../models/assets/ReceivedItems.js");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const received = await GoodsReceived.create(req.body);

        const item = req.body.rows.map((row) => ({ ...row, goodsId: received.id }));
        await GoodsItems.bulkCreate(item);

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

router.get("/", async (req, res) => {
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

router.get("/items/:id", async (req, res) => {
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

router.patch("/:id", async (req, res) => {
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

router.get("/:id", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
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