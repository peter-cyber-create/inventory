import { sequelize, DataTypes } from '../../config/db.js';
import ReceivedItems from './ReceivedItems.js';

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

export default GoodsReceived;
