const { sequelize, DataTypes } = require('../../config/db.js');
const Vehicle = require("../vehicles/vehicleModel.js");

const Disposal = sequelize.define(
  "disposal",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // disposalMethod: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    disposalReason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disposalCost: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disposedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehicle,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

Disposal.belongsTo(Vehicle, { foreignKey: "vehicleId" });
// Disposal.sync({ alter: true });

module.exports = Disposal;
