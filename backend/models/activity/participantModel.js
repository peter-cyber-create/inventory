import { sequelize, DataTypes } from '../../config/db.js';
const Activity = require('./activityModel.js');

const Participant = sequelize.define("participant", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    days: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    activityId: {
        type: DataTypes.INTEGER,
        references: {
            model: Activity,
            key: 'id',
        },
    },
}, { timestamps: true });

Participant.belongsTo(Activity, { foreignKey: 'activityId' });
// Participant.sync({ alter: true });

module.exports = Participant;