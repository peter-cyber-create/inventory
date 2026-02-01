const sequelize, DataTypes = require('../../config/db.js');
const VehicleModel = require("./vehicleModel.js");

const VDisposalModel = sequelize.define(
  "VDisposal",
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
        model: VehicleModel,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

VDisposalModel.belongsTo(VehicleModel, { foreignKey: "vehicleId" });
// VDisposalModel.sync({ alter: true });

module.exports = VDisposalModel;
