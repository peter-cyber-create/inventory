const express = require('express');
import { Op } from 'sequelize';
const Activity = require("../../models/activity/activityModel.js");
const Participant = require("../../models/activity/participantModel.js");
const User = require('../../models/users/userModel.js');

const router = express.Router();

router.get('/date', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const activities = await Activity.findAll({
            where: {
                startDate: {
                    [Op.between]: [startDate, endDate]
                }
            },
            // include: [
            //     {
            //         model: Participant,
            //         attributes: ['name', 'title', 'amount', 'days']
            //     }
            // ],
            order: [['startDate', 'DESC']]
        });

        res.json({ activities });
    } catch (error) {
        console.error('Error fetching activities by date:', error);
        res.status(500).json({ message: 'Error fetching activities by date' });
    }
});

router.get('/funding', async (req, res) => {
    try {
        const { funder } = req.query;

        const activities = await Activity.findAll({
            where: funder ? { funder } : {},
            // include: [
            //     {
            //         model: Participant,
            //         attributes: ['name', 'title', 'amount', 'days']
            //     }
            // ],
            order: [['funder', 'ASC'], ['startDate', 'DESC']]
        });

        res.json({ activities });
    } catch (error) {
        console.error('Error fetching activities by funding:', error);
        res.status(500).json({ message: 'Error fetching activities by funding' });
    }
});

router.get('/person', async (req, res) => {
    try {
        const { name } = req.query;

        const whereCondition = name
            ? { name: { [Op.iLike]: `%${name}%` } }
            : {};

        const participants = await Participant.findAll({
            where: whereCondition,
            include: [
                {
                    model: Activity,
                }
            ],
            order: [['name', 'ASC']]
        });

        res.json({ participants });
    } catch (error) {
        console.error('Error fetching activities per person:', error);
        res.status(500).json({ message: 'Error fetching activities per person' });
    }
});

// Pending Accountability (No Reports)
router.get('/accountability', async (req, res) => {
    try {
        const activities = await Activity.findAll({
            where: {
                reportPath: null,
                // status: 'open'
            },
            include: [
                {
                    model: User,
                }
            ],
            order: [['createdAt', 'ASC']]
        });

        res.json({ activities });
    } catch (error) {
        console.error('Error fetching pending accountability:', error);
        res.status(500).json({ message: 'Error fetching pending accountability' });
    }
});

module.exports = router;