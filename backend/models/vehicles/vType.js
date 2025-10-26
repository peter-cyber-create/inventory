import { sequelize, DataTypes } from '../../config/db.js';

const VType = sequelize.define("vtype", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: true});

VType.sync({ alter: true });

module.exports = VType;
