const { sequelize, DataTypes } = require('../../config/db.js');
const Vehicle = require("./vehicleModel.js");
const Driver = require("./vDrivers.js");
const Department = require("../categories/departmentModel.js");

const VServiceRequest = sequelize.define(
  "vservicerequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    currentMileage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastServiceMileage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    registrationNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driverName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceOfficer: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    projectUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    emailAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reqDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isRequest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehicle,
        key: "id",
      },
    },
  },
  { timestamps: true }
);

VServiceRequest.belongsTo(Vehicle, { foreignKey: "vehicleId" });
// VServiceRequest.belongsTo(Department, { foreignKey: 'deptId' });

// VServiceRequest.sync({ alter: true });

module.exports = VServiceRequest;
