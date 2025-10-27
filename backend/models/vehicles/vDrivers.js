import { sequelize, DataTypes } from "../../config/db.js";

const VDrivers = sequelize.define(
  "vdriver",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
// VDrivers.sync({ alter: false });
module.exports = VDrivers;
