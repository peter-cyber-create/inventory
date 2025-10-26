const { sequelize, DataTypes } = require('../../config/db.js');

const Facility = sequelize.define("facility", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: true });

//Facility.sync({ alter: true });

module.exports = Facility;
