const sequelize, DataTypes = require('../../config/db.js');

const VGarage = sequelize.define("vgarage", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: true,
});

// VGarage.sync({ alter: true });

module.exports = VGarage;
