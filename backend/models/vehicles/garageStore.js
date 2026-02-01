const { sequelize, DataTypes } = require('../../config/db.js');
const VehicleParts = require('./VehicleParts.js');

const GarageStore = sequelize.define("garagestore", {
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
        allowNull: false
    },
    qtyDispatched: {
        type: DataTypes.NUMERIC,
        allowNull: false,
    },
    currentStock: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0
    },
    usedStock: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        defaultValue: 0
    },
    specification: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dispatchedBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dispatchedTo: {
        type: DataTypes.STRING,
        allowNull: false
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

// GarageStore.sync({ alter: true });
GarageStore.belongsTo(VehicleParts, { foreignKey: 'partId' });

module.exports = GarageStore;
