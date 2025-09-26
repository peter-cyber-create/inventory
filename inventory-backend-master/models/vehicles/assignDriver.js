import { sequelize, DataTypes } from '../../config/db.js';

const AssignDriver = sequelize.define("assigndriver", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    driver: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: true });

// AssignDriver.associate = (models) => {
//     AssignDriver.belongsTo(models.VehicleModel);
// };

export default AssignDriver;
