import express from "express";
import Staff from "../../models/categories/staffModel.js";
import Departs from "../../models/categories/departments.js";
import Division from "../../models/categories/divisions.js";

const router = express.Router();

router.post("/", async (req, res) => {

    try {
        const staff = await Staff.create(req.body);

        res.status(201).json({
            status: "success",
            staff
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
        const limit = req.query.limit || 500;
        const skip = (page - 1) * limit;

        const staff = await Staff.findAll({ limit, offset: skip, include: [{ model: Departs }, { model: Division }] });

        res.status(200).json({
            status: "success",
            results: staff.length,
            staff,
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
        const result = await Staff.update(
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

        const staff = await Staff.findByPk(req.params.id);

        res.status(200).json({
            status: "success",
            staff
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
        const staff = await Staff.findByPk(req.params.id);

        if (!staff) {
            return res.status(404).json({
                status: "fail",
                message: "Server with that ID not found",
            });
        }

        res.status(200).json({
            status: "success",
            staff,
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
        const result = await Staff.destroy({
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