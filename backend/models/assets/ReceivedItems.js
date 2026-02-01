const { sequelize, DataTypes } = require('../../config/db.js');

const ReceivedItems = sequelize.define("receivedItems", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product: {
        type: DataTypes.STRING,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
    },
    qty: {
        type: DataTypes.STRING,
    },
    rate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    invoiceValue: {
        type: DataTypes.STRING,
    },
}, { timestamps: true });

module.exports = ReceivedItems;
