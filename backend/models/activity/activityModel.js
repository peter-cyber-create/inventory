import { sequelize, DataTypes } from '../../config/db.js';
const User = require('../users/userModel.js');

const Activity = sequelize.define("activity", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    activityName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    requested_by: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dept: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    funder: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending_accountability'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    invoiceDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    days: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    amt: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    reportPath: {
        type: DataTypes.STRING,
        allowNull: true
    },
    closedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    vocherno: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
    },
}, { timestamps: true });

Activity.sync({ alter: true });
Activity.belongsTo(User, { foreignKey: 'created_by' });

module.exports = Activity;
