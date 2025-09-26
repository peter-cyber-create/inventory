import { sequelize, DataTypes } from '../../config/db.js';
import JobCard from './jobCardModel.js';

const PartsUsed = sequelize.define("vpartused", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    partId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    partno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    partname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    qtyUsed: {
        type: DataTypes.NUMERIC,
        allowNull: true,
        defaultValue: 0
    },
    jobCardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: JobCard,
            key: 'id'
        }
    },
}, { timestamps: true });

// PartsUsed.sync({ alter: true });
PartsUsed.belongsTo(JobCard, { foreignKey: 'jobCardId' });

export default PartsUsed;
