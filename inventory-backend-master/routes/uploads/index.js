
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const XLSX = require("xlsx");
const Model = require("../../models/categories/model.js");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/models", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        for (const row of sheetData) {
            const { name, description, categoryId, brandId } = row;

            if (!name || !description || !categoryId || !brandId) {
                console.warn("Missing required fields in row:", row);
                continue; 
            }

            await Model.create({
                name,
                description,
                categoryId,
                brandId,
            });
        }

        // Delete the temporary file after processing
        fs.unlinkSync(req.file.path);

        res.status(200).send("File uploaded and data inserted into the database");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error processing the file");
    }
});

module.exports = router;