import { sequelize, DataTypes } from "../../config/db.js";
import Departs from "./departments.js";
import Division from "./divisions.js";

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
            allowNull: false,
            references: {
                model: Departs,
                key: "id",
            },
        },
        divisionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Division,
                key: "id",
            },
        },
    },
    { timestamps: true }
);

Staff.belongsTo(Departs, { foreignKey: "deptId" });
Staff.belongsTo(Division, { foreignKey: "divisionId" });

// Staff.sync({ alter: true });

export default Staff;
