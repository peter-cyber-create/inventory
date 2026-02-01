const sequelize, DataTypes = require('../../config/db.js');
const Asset = require('./assetsModel.js');

const TransferModel = sequelize.define("tranfers", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    previousUser: {
        type: DataTypes.STRING,
        allowNull: false
    },
    previousDept: {
        type: DataTypes.STRING,
        allowNull: false
    },
    previousTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
    },
    officeNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
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

// TransferModel.sync({ alter: true });
TransferModel.belongsTo(Asset, { foreignKey: 'assetId' });

module.exports = TransferModel;
