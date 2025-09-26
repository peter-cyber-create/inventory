import { sequelize, DataTypes } from "../../config/db.js";
import Vehicle from "./vehicleModel.js";
import Driver from "./vDrivers.js";
import Department from "./departments.js";

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

export default VServiceRequest;
