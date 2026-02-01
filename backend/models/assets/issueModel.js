const sequelize, DataTypes = require('../../config/db.js');
const Asset = require('./assetsModel.js');
const Staff = require('../categories/staffModel.js');

const Issue = sequelize.define("issue", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    issuedBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    staffId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Staff,
            key: 'id'
        }
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

// Issue.sync({ alter: true });
Issue.belongsTo(Asset, { foreignKey: 'assetId' });
Issue.belongsTo(Staff, { foreignKey: 'staffId' });

module.exports = Issue;
