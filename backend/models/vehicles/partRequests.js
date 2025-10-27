import { sequelize, DataTypes } from '../../config/db.js';
const VehicleParts = require('./VehicleParts.js');

const PartRequests = sequelize.define("partrequests", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    partname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    partno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    requestedBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qtyMainStore: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0
    },
    qtyRequested: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0
    },
    specification: {
        type: DataTypes.STRING,
        allowNull: true
    },
    storesDispatched: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: VehicleParts,
            key: 'id'
        }
    },

}, { timestamps: true });

// PartRequests.sync({ alter: true });
PartRequests.belongsTo(VehicleParts, { foreignKey: 'partId' });

module.exports = PartRequests;
