const { sequelize, DataTypes } = require('../../config/db.js');

const Vehicle = require("../vehicles/vehicleModel.js");

const JobCardModel = sequelize.define(
  "jobCards",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehicle,
        key: "id",
      },
    },

    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceAdvisor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    technicianComment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    defects: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // dateOfSale: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    // },
    // dateIn: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    // },
    // dateOut: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    // },
    // dateOfDelivery: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    // },
    driverOrCustomerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    testorSignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    workshopManager: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // dateClosed: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    // },
    // dateTested: {
    //   type: DataTypes.DATEONLY,
    //   allowNull: true,
    // },
    jack: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    wheelSpanner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },

    windscreenDamage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.ENUM("Cash", "Credit"),
      allowNull: true,
    },
    fuele: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    fuelPlusOrMinus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    fuelf: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },

    workItems: {
      type: DataTypes.JSON,
      allowNull: true,
      comment:
        "Array of work items with fields: workDescription, quantity, unitPrice, amount",
    },
  },
  { timestamps: true }
);

JobCardModel.belongsTo(Vehicle, { foreignKey: "vehicleId" });
Vehicle.hasMany(JobCardModel, { foreignKey: "vehicleId" });
// JobCardModel.sync({ alter: true });

module.exports = JobCardModel;
