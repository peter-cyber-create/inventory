import { sequelize, DataTypes } from "../../config/db.js";

// import spare from "../sparePartsStore/SpareStore.js";

import VSpareParts from "../vehicles/vSpareParts.js";

const JobCardSpare = sequelize.define(
  "JobCardSpare",
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    partname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    partno: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    spareId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: VSpareParts,
        key: "id",
      },
    },
    JobCardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    measure: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unitPrice: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      defaultValue: 0,
    },

    qtyUsed: {
      type: DataTypes.NUMERIC,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    // schema: "garage",
  }
);

JobCardSpare.belongsTo(VSpareParts, { foreignKey: "spareId" });

JobCardSpare.sync({ alter: false });

export default JobCardSpare;
