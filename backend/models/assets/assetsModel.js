const sequelize, DataTypes = require('../../config/db.js');
const Category = require('../categories/categoryModel.js');
const Brand = require('../categories/brandModel.js');
const Model = require('../categories/model.js');
const Type = require('../categories/typeModel.js');
const Staff = require('../categories/staffModel.js');

const AssetModel = sequelize.define("assets", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serialNo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    engravedNo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    processor: {
        type: DataTypes.STRING,
    },
    memory: {
        type: DataTypes.STRING,
    },
    graphics: {
        type: DataTypes.STRING,
    },
    storage: {
        type: DataTypes.STRING,
    },
    orderNo: {
        type: DataTypes.STRING,
    },
    supplier: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "InStores"
    },
    funding: {
        type: DataTypes.STRING,
    },
    funder: {
        type: DataTypes.STRING,
    },
    purchaseCost: {
        type: DataTypes.DOUBLE,
    },
    purchaseDate: {
        type: DataTypes.DATE,
    },
    warrantly: {
        type: DataTypes.STRING,
    },
    estimatedCost: {
        type: DataTypes.STRING,
    },
    requisition: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    storesdispatch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    itissue: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isdisposed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    typeId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Changed to true - database column is nullable
        references: {
            model: Type,
            key: 'id'
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Changed to true - database column is nullable
        references: {
            model: Category,
            key: 'id'
        }
    },
    brandId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Changed to true - database column is nullable
        references: {
            model: Brand,
            key: 'id'
        }
    },
    modelId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Changed to true - database column is nullable
        references: {
            model: Model,
            key: 'id'
        }
    },
    staffId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Changed to true - database column is nullable
        references: {
            model: Staff,
            key: 'id'
        }
    },
}, { timestamps: true });

AssetModel.belongsTo(Type, { foreignKey: 'typeId' });
AssetModel.belongsTo(Brand, { foreignKey: 'brandId' });
AssetModel.belongsTo(Category, { foreignKey: 'categoryId' });
AssetModel.belongsTo(Model, { foreignKey: 'modelId' });
AssetModel.belongsTo(Staff, { foreignKey: 'staffId' });

// AssetModel.sync({ alter: true });

module.exports = AssetModel;
