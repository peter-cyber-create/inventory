const express = require("express");
const { Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../../config/db.js');
const Activity = require("../../models/activity/activityModel.js");
const Participant = require("../../models/activity/participantModel.js");
const Auth = require("../../middleware/auth.js");
const authorize = require("../../middleware/authorize.js");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/reports';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.get('/my', Auth, authorize('admin', 'finance'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const activities = await Activity.findAll({ limit, offset, where: { created_by: req.user.id } });

        res.status(200).json({
            status: "success",
            results: activities.length,
            activities,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
});

router.post('/upload', Auth, authorize('admin', 'finance'), upload.single('activityReport'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { id } = req.body;
        if (!id) {
            return res.status(404).json({ message: 'Activity ID is required' });
        }

        const activity = await Activity.findByPk(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await activity.update({
            reportPath: req.file.filename,
            status: 'activity_closed',
            // closedDate: new Date()
        });

        res.status(200).json({
            message: 'Report uploaded successfully and activity closed',
            filePath: req.file.filename
        });

    } catch (error) {
        console.error('Error uploading report:', error);

        // Handle multer errors
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
            }
            return res.status(400).json({ message: 'File upload error' });
        }

        res.status(500).json({
            message: 'Server error while uploading file',
            error: error.message
        });
    }
});

router.post("/", Auth, authorize('admin', 'finance'), async (req, res) => {
    const { activityName, dept, startDate, endDate, days, amt, funder, rows, requested_by, invoiceDate, vocherno } = req.body;

    // Validate request data
    // if (!activityName || !dept || !startDate || !endDate || !days || !amt || !funder || !rows || rows.length === 0) {
    //     return res.status(400).json({ message: 'Incomplete data provided. Please ensure all fields are filled correctly.' });
    // }

    try {
        // Create new activity
        const newActivity = await Activity.create({
            activityName,
            dept,
            invoiceDate,
            vocherno,
            startDate,
            endDate,
            days,
            amt,
            funder,
            requested_by,
            created_by: req.user.id
        });

        const participants = rows.map((row) => ({
            name: row.name,
            title: row.title,
            email: row.email,
            phone: row.phone,
            amount: row.amount,
            days: row.days,
            activityId: newActivity.id,
        }));

        await Participant.bulkCreate(participants);

        return res.status(200).json({ message: 'Activity and participants added successfully.' });
    } catch (error) {
        console.error('Error saving data:', error);

        // Handle specific Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(400).json({
                message: 'Validation error.',
                errors: validationErrors
            });
        }

        // Handle specific database errors
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({
                message: 'Database error occurred.',
                details: error.message
            });
        }

        // Generic error fallback
        return res.status(500).json({
            message: 'An unexpected error occurred while saving data.',
            details: error.message
        });
    }
});

router.get("/", Auth, authorize('admin', 'finance'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const activities = await Activity.findAll({ limit, offset });

        res.status(200).json({
            status: "success",
            results: activities.length,
            activities,
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

router.get("/duplicates", Auth, authorize('admin', 'finance'), async (req, res) => {
    try {
        const duplicatesQuery = `
            SELECT 
                p."name",
                p.title,
                p.email, 
                p.phone,
                SUM(p.days) AS "days"
                FROM public.participants p
                GROUP BY p."name", p.title, p.email, p.phone
                HAVING SUM(p.days) >= 150
                ORDER BY p."name";
        `;

        // Execute raw SQL query using Sequelize
        const duplicates = await sequelize.query(duplicatesQuery, {
            type: Sequelize.QueryTypes.SELECT
        });

        if (!duplicates.length) {
            return res.status(404).json({ message: 'No duplicate participants found.' });
        }

        res.status(200).json(duplicates);
    } catch (error) {
        console.error('Error fetching duplicates:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get("/days", Auth, authorize('admin', 'finance'), async (req, res) => {
    try {
        const duplicatesQuery = `
            SELECT 
                p."name",
                p.title,
                p.email , 
                p.phone ,
                SUM(p.days) AS "days"
                FROM public.participants p
                GROUP BY p."name", p.title, p.email , p.phone 
                ORDER BY p."name";
        `;

        // Execute raw SQL query using Sequelize
        const duplicates = await sequelize.query(duplicatesQuery, {
            type: Sequelize.QueryTypes.SELECT
        });

        if (!duplicates.length) {
            return res.status(404).json({ message: 'No Days Found found.' });
        }

        res.status(200).json(duplicates);
    } catch (error) {
        console.error('Error fetching Days:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get("/participant", Auth, authorize('admin', 'finance'), async (req, res) => {
    try {
        const query = `
            SELECT 
                p."name",
                p.title,
                p.phone ,
                a."activityName",
                p.days,
                p.amount,
                a."invoiceDate",
                a.vocherno,
                a.funder 
            FROM public.participants p
            inner join activities a on a.id = p."activityId" 
            ORDER BY p."name";
        `;

        const participants = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        });

        if (!participants.length) {
            return res.status(404).json({ message: 'No Days Found found.' });
        }

        res.status(200).json(participants);
    } catch (error) {
        console.error('Error fetching Days:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.get("/amounts", Auth, authorize('admin', 'finance'), async (req, res) => {
    try {
        const query = `
            SELECT 
                p."name",
                p.title,
                p.phone ,
                sum(p.days) as Total_days,
                sum(p.amount) as Total_amount
            FROM public.participants p
            inner join activities a on a.id = p."activityId"
            group by p."name" , p.title , p.phone 
            ORDER BY p."name";
        `;

        const participants = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        });

        if (!participants.length) {
            return res.status(404).json({ message: 'No Days Found found.' });
        }

        res.status(200).json(participants);
    } catch (error) {
        console.error('Error fetching Days:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.patch("/:id", Auth, authorize('admin', 'finance'), async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Activity.update(req.body, { where: { id } });

        if (!updated) {
            return res.status(404).json({ message: "Activity not found." });
        }

        const activity = await Activity.findByPk(id);
        res.status(200).json({ status: "success", activity });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ message: 'Error updating activity.' });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findByPk(id);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        res.status(200).json({ status: "success", activity });
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ message: 'Error fetching activity.' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Activity.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: "Activity not found." });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ message: 'Error deleting activity.' });
    }
});

router.post('/:id/participants', async (req, res) => {
    try {
        const { id } = req.params;
        const { participants } = req.body;

        // First, delete all existing participants
        await Participant.destroy({
            where: { activityId: id }
        });

        // Then create new participants
        const newParticipants = participants.map(p => Object.assign({}, p, {
            activityId: id
        }));

        await Participant.bulkCreate(newParticipants);

        res.status(200).json({
            message: 'Participants updated successfully'
        });
    } catch (error) {
        console.error('Error updating participants:', error);
        res.status(500).json({
            message: 'Error updating participants',
            error: error.message
        });
    }
});

router.get("/participants/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const participants = await Participant.findAll({
            where: { activityId: id },
            limit,
            offset,
        });

        res.status(200).json({
            status: "success",
            results: participants.length,
            participants,
        });
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Error fetching participants.' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Activity.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: "Activity not found." });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ message: 'Error deleting activity.' });
    }
});

router.delete('/participant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Participant.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Participant not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting participant:', error);
        res.status(500).json({
            message: 'Error deleting participant',
            error: error.message
        });
    }
});


module.exports = router;