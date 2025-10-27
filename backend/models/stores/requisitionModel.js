const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Requisition = sequelize.define('requisitions', {
  requisition_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // Form 76A specific fields
  serial_no: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  requisition_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  form_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  from_department: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  to_store: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  purpose_remarks: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  // Department and user relationships
  department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'departments',
      key: 'id'
    },
    index: true // For scalability
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    allowNull: false,
    comment: 'Requisition Officer'
  },
  // Dynamic signatory roles (assignable per requisition)
  approving_officer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Approving Officer'
  },
  issuing_officer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Issuing Officer (Stores Manager)'
  },
  head_of_department_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Head of Department'
  },
  // Legac: Backward compatibility
  department: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 255]
    }
  },
  purpose: {
    type: DataTypes.TEXT
  },
  urgency: {
    type: DataTypes.ENUM,
    values: ['normal', 'urgent', 'emergency'],
    defaultValue: 'normal'
  },
  requested_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  supervisor_approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  finance_approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  auditor_approved_by: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Workflow status: Pending → Approved → Issued → Closed
  status: {
    type: DataTypes.ENUM,
    values: ['draft', 'pending', 'submitted', 'approved', 'issued', 'partially_issued', 'closed', 'rejected', 'printed'],
    defaultValue: 'draft',
    index: true // For scalability
  },
  rejection_reason: {
    type: DataTypes.TEXT
  },
  total_value: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Timestamps for workflow tracking
  submitted_at: {
    type: DataTypes.DATE
  },
  approved_at: {
    type: DataTypes.DATE
  },
  issued_at: {
    type: DataTypes.DATE
  },
  closed_at: {
    type: DataTypes.DATE
  },
  required_date: {
    type: DataTypes.DATE
  },
  printed_at: {
    type: DataTypes.DATE
  },
  // Audit fields
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'requisitions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['department_id'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
    { fields: ['created_by'] }
  ]
});

module.exports = Requisition;
