const sequelize, DataTypes = require('../../config/db.js');
const Vehicle = require("./vehicleModel.js");

const GarageReceive = sequelize.define(
  "vgarageReceive",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    receivedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    funding: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instruction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inGarage: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    tools: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vehicle,
        key: "id",
      },
    },
    transportOfficer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    vehicleReg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driverName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mileage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    battery: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    radiator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    engineOil: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    brakes: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tires: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lights: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    steering: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    clutch: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    gearbox: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    differential: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    propeller: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    waterLevel: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userSignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    acceptedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

// Establish relationships
GarageReceive.belongsTo(Vehicle, { foreignKey: "vehicleId" });
// GarageReceive.sync({ alter: true });

module.exports = GarageReceive;

// import { sequelize, DataTypes } from '../../config/db.js';
// import Vehicle from './vehicleModel.js';

// const GarageReceive = sequelize.define("vgarageReceive", {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     receivedBy: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     contactName: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     phoneNo: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     funding: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     instruction: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     inGarage: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     },
//     tools: {
//         type: DataTypes.ARRAY(DataTypes.STRING),
//         allowNull: false,
//     },
//     vehicleId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: Vehicle,
//             key: 'id'
//         }
//     },

// }, { timestamps: true });

// // GarageReceive.sync({ alter: true });
// GarageReceive.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

// export default GarageReceive;
