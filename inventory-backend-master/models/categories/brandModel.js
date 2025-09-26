const { sequelize, DataTypes } = require("../../config/db.js");

const Brand = sequelize.define(
  "brand",
  {
    id: {
      type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

// Brand.sync({ alter: true });

module.exports = Brand;
