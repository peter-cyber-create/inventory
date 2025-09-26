import { sequelize, DataTypes } from '../../config/db.js';

const ServerModel = sequelize.define("servers", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    serialNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    engranvedNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serverName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    IP: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    memory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    purchaseDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    processor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hypervisor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hardDisk: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: true });


export default ServerModel;
