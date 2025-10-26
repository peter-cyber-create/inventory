const express = require("express");
const ServerModal = require("../../models/server/serverModel.js");

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const { serialNo, engranvedNo, serverName, productNo, brand, IP, purchaseDate, warrantly, expiryDate, memory,
            processor, hypervisor, hardDisk } = req.body;

        const server = await ServerModal.create({
            serialNo, engranvedNo, serverName, productNo, brand, IP, purchaseDate, warrantly, expiryDate, memory,
            processor, hypervisor, hardDisk
        });
        res.status(201).json({
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

router.get("/", async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const skip = (page - 1) * limit;

        const servers = await ServerModal.findAll({ limit, offset: skip });

        res.status(200).json({
            status: "success",
            results: servers.length,
            servers,
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
        const result = await ServerModal.update(
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

        const server = await ServerModal.findByPk(req.params.id);

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
        const server = await ServerModal.findByPk(req.params.id);

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
        const result = await ServerModal.destroy({
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