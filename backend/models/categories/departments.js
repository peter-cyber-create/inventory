const { sequelize, DataTypes } = require('../../config/db.js');

const Departs = sequelize.define("depart", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, { timestamps: true });

// Department.sync({ alter: true });

module.exports = Departs;
