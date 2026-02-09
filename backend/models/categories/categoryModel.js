const { sequelize, DataTypes } = require("../../config/db.js");
const Type = require("./typeModel.js");

const Category = sequelize.define(
  "category",
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
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Type,
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

Category.belongsTo(Type, { foreignKey: "typeId" });

// Category.sync({ alter: true });

module.exports = Category;
