const { sequelize, DataTypes } = require("../../config/db.js");
const Departs = require("./departments.js");
const Division = require("./divisions.js");

const Staff = sequelize.define("staff",
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
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneno: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deptId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Departs,
                key: "id",
            },
        },
        divisionId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Division,
                key: "id",
            },
        },
    },
    { 
        timestamps: true,
        tableName: 'staff', // Explicitly set table name to prevent pluralization
        freezeTableName: true // Prevent Sequelize from pluralizing
    }
);

Staff.belongsTo(Departs, { foreignKey: "deptId" });
Staff.belongsTo(Division, { foreignKey: "divisionId" });

// Staff.sync({ alter: true });

module.exports = Staff;
