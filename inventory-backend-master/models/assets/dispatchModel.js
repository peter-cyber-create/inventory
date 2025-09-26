import { sequelize, DataTypes } from '../../config/db.js';
import Asset from './assetsModel.js';

const Dispatch = sequelize.define("dispatch", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    dispatchedBy: {
        type: DataTypes.STRING,
    },
    dispatchedTo: {
        type: DataTypes.STRING,
    },
    serialNo: {
        type: DataTypes.STRING,
    },
    model: {
        type: DataTypes.STRING,
    },
    comments: {
        type: DataTypes.STRING,
    },
    isIssued: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    assetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Asset,
            key: 'id'
        }
    },
}, { timestamps: true });

// Dispatch.sync({ alter: true });

Dispatch.belongsTo(Asset, { foreignKey: 'assetId' });

export default Dispatch;
