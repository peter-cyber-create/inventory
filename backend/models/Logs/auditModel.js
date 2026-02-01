const sequelize, DataTypes = require('../../config/db.js');

const Audit = sequelize.define("audit", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    actionedBy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    assetId: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, { timestamps: true });

// Audit.sync({ alter: false });

module.exports = Audit;
