const sequelize, DataTypes = require('../../config/db.js');
const Vehicle = require('./vehicleModel.js');

const JobCard = sequelize.define("vjobcards", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    numberPlate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Vehicle,
            key: 'id'
        }
    },
}, { timestamps: true });

// JobCard.sync({ alter: false });
JobCard.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

module.exports = JobCard;
