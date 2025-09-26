import { sequelize, DataTypes } from '../../config/db.js';
import AssetDetails from './assetDetails.js';

const UserDetails = sequelize.define("userDetails", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNo: {
        type: DataTypes.STRING,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
    },
    purchaseDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, { timestamps: true });

// UserDetails.sync({ alter: true });
UserDetails.hasMany(AssetDetails, { foreignKey: 'userId', sourceKey: "id", });

export default UserDetails;
