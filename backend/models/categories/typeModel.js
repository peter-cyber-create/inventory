const { sequelize, DataTypes } = require('../../config/db.js');

const Type = sequelize.define("type", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
    },
}, { timestamps: true });

// Type.sync({ alter: true });

module.exports = Type;
