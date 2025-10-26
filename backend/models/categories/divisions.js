const { sequelize, DataTypes } = require("../../config/db.js");
const Departs = require("./departments.js");

const Division = sequelize.define("division",
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
        deptId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Departs,
                key: "id",
            },
        },
    },
    { timestamps: true }
);

Division.belongsTo(Departs, { foreignKey: "deptId" });

// Division.sync({ alter: true });

module.exports = Division;
