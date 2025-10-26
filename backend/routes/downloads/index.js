const express = require("express");
const XLSX = require("xlsx");
const Model = require("../../models/categories/model.js");
const Brand = require("../../models/categories/brandModel.js");
const Category = require("../../models/categories/categoryModel.js");

const router = express.Router();

router.get("/models", async (req, res) => {
    try {

        const models = await Model.findAll({
            include: [
                { model: Brand, attributes: ["name"] },
                { model: Category, attributes: ["name"] },
            ],
        });

        // Transform data to include names instead of IDs
        const transformedData = models.map((model) => ({
            Name: model.name,
            Category: model.category?.name || "N/A",
            Brand: model.brand?.name || "N/A",
            Description: model.description || "",
        }));

        // Create an Excel file
        const worksheet = XLSX.utils.json_to_sheet(transformedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ICT Models");

        // Write Excel file to buffer
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        // Send the Excel file to the client
        res.setHeader("Content-Disposition", "attachment; filename=models.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.status(200).send(excelBuffer);
    } catch (error) {
        console.error("Error downloading models:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to download models",
        });
    }
});

module.exports = router;