import { sequelize, DataTypes } from '../../config/db.js';

const VehicleParts = sequelize.define("vehicleparts", {
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
    specification: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0
    },
    qtyDispatched: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0
    },


}, { timestamps: true });

VehicleParts.sync({ alter: true });
module.exports = VehicleParts;
