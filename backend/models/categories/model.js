const { sequelize, DataTypes } = require("../../config/db.js");
const Category = require("./categoryModel.js");
const Brand = require("./brandModel.js");

const Model = sequelize.define(
  "model",
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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Brand,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

Model.belongsTo(Category, { foreignKey: "categoryId" });
Model.belongsTo(Brand, { foreignKey: "brandId" });

// Model.sync({ alter: true });

module.exports = Model;
