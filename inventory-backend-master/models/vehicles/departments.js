import { sequelize, DataTypes } from '../../config/db.js';

const Department = sequelize.define("department", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deptHead: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: true });

export default Department;
