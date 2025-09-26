import { sequelize, DataTypes } from '../../config/db.js';
import Asset from './assetsModel.js';

const Maintenance = sequelize.define("maintenance", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    servicedBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    servicedOn: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nextService: {
        type: DataTypes.STRING,
        allowNull: false
    },
    taskName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
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

// Maintenance.sync({ alter: true });
Maintenance.belongsTo(Asset, { foreignKey: 'assetId' });

export default Maintenance;
