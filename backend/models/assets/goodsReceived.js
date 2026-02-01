const sequelize, DataTypes = require('../../config/db.js');
const ReceivedItems = require('./ReceivedItems.js');

const GoodsReceived = sequelize.define("goodsReceived", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    deliveryDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    invoiceNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    RefNo: {
        type: DataTypes.STRING,
    },
    NoteNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    supplier: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Received'
    },
    receivedBy: {
        type: DataTypes.STRING,
    },
}, { timestamps: true });

// GoodsReceived.sync({ alter: false });

GoodsReceived.hasMany(ReceivedItems, { foreignKey: 'goodsId', sourceKey: "id", });

module.exports = GoodsReceived;
