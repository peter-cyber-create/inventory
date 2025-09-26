const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Item = sequelize.define('items', {
  item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  item_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Medical', 'Office', 'IT', 'Maintenance', 'Laboratory', 'Pharmacy', 'Cleaning', 'Kitchen', 'Other']]
    }
  },
  sub_category: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 255]
    }
  },
  unit_of_measure: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Piece', 'Box', 'Carton', 'Bottle', 'Vial', 'Packet', 'Kg', 'Gram', 'Litre', 'ML', 'Meter', 'Roll', 'Set', 'Dozen']]
    }
  },
  reorder_level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  max_level: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0
    }
  },
  supplier_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'suppliers',
      key: 'supplier_id'
    }
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'locations',
      key: 'location_id'
    }
  },
  unit_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Item;
