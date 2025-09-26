import { sequelize, DataTypes } from '../../config/db.js';
import Asset from './assetsModel.js';

const Requisition = sequelize.define("requisition", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    requestedBy: {
        type: DataTypes.STRING,
    },
    serialNo: {
        type: DataTypes.STRING,
    },
    comments: {
        type: DataTypes.STRING,
    },
    model: {
        type: DataTypes.STRING,
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

// Requisition.sync({ alter: true });

Requisition.belongsTo(Asset, { foreignKey: 'assetId' });

export default Requisition;
