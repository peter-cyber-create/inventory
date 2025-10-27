const { sequelize, DataTypes } = require("../../config/db.js");
const Facility = require("../categories/facilityModel.js");

const UserModel = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // phoneNo: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    module: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    depart: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    facilityid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Facility,
        key: "id",
      },
    },
  },
  { 
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  }
);

//UserModel.sync({ alter: true });
UserModel.belongsTo(Facility, { foreignKey: "facilityid" });

module.exports = UserModel;
