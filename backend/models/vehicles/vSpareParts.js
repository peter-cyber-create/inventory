const sequelize, DataTypes = require('../../config/db.js');
const VSpareCategory = require("./vSpareCategory.js");

const VSpareParts = sequelize.define(
  "vspareparts",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    partname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measure: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unitPrice: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      defaultValue: 0,
    },
    qty: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      defaultValue: 0,
    },
    qtyUsed: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      defaultValue: 0,
    },
    qtyAvailable: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VSpareCategory,
        key: "id",
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

VSpareParts.belongsTo(VSpareCategory, { foreignKey: "categoryId" });

// VSpareParts.sync({ alter: true });

module.exports = VSpareParts;
