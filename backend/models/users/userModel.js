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
    health_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      },
      comment: 'Official health mail (e.g., user@health.go.ug)'
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Contact phone number'
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Job title/designation (e.g., Senior Officer, Manager)'
    },
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
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'departments',
        key: 'id'
      },
      comment: 'Reference to departments table'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether the user account is active'
    },
  },
  { 
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
  }
);

//UserModel.sync({ alter: true });
// Temporarily disable association to avoid boot-time errors if Facility isn't a Sequelize model
// UserModel.belongsTo(Facility, { foreignKey: "facilityid" });

module.exports = UserModel;
