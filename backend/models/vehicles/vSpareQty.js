const { sequelize, DataTypes } = require('../../config/db.js');
const VSpareParts = require("./vSpareParts.js");

const VSparePartsQty = sequelize.define(
  "vsparepartsQty",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    prevSpareQty: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    receivedSpareQty: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    finalSpareQty: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },

    spareId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VSpareParts,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

VSparePartsQty.belongsTo(VSpareParts, { foreignKey: "spareId" });

// VSparePartsQty.sync({ alter: true });

module.exports = VSparePartsQty;
