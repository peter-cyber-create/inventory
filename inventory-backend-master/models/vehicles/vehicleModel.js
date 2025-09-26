import { sequelize, DataTypes } from "../../config/db.js";

const VehicleModel = sequelize.define(
  "vehicle",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    old_number_plate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    new_number_plate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chassis_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    engine_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    YOM: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fuel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    power: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    total_cost: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_of_origin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mileage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driver: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    officer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sticker_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

//VehicleModel.sync({ alter: true });
export default VehicleModel;
