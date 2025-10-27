import { sequelize, DataTypes } from '../../config/db.js';

const VSpareCategory = sequelize.define("vsparecategory", {
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
    timestamps: true
});

// VSpareCategory.sync({ alter: true });

module.exports = VSpareCategory;
